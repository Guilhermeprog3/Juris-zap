import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Inicializa o Firebase Admin (sabemos que isso funciona)
admin.initializeApp();
const db = admin.firestore();

// --- INÍCIO DA CORREÇÃO: INICIALIZAÇÃO PREGUIÇOSA DO STRIPE ---

// Declaramos a variável `stripe` aqui, mas não a inicializamos ainda.
let stripe: Stripe;

/**
 * Pega a instância do cliente Stripe, criando-a apenas na primeira vez que for usada.
 * Isso garante que `functions.config()` já esteja disponível.
 */
function getStripeClient() {
  if (!stripe) {
    console.log("Inicializando o cliente Stripe...");
    stripe = new Stripe(functions.config().stripe.secret, {
      apiVersion: "2025-05-28.basil",
      typescript: true,
    });
    console.log("Cliente Stripe inicializado com sucesso.");
  }
  return stripe;
}
// --- FIM DA CORREÇÃO ---


export const createStripeCheckoutSession = functions.https.onCall(
  async (data) => {
    // Usamos a função para pegar o cliente Stripe
    const stripeClient = getStripeClient();

    const {priceId, email, nome, telefone} = data as unknown as {
      priceId: string;
      email: string;
      nome: string;
      telefone: string;
    };

    if (!priceId || !email || !nome || !telefone) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Essential data (plan, email, name, phone) is missing."
      );
    }

    const successUrl = "http://localhost:3000/dashboard?payment_success=true";
    const cancelUrl = "http://localhost:3000/planos";

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        customer_email: email,
        metadata: {
          firebase_nome: nome,
          firebase_telefone: telefone,
          price_id: priceId,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return {sessionId: session.id};
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Could not create the payment session."
      );
    }
  }
);

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  // Usamos a função para pegar o cliente Stripe
  const stripeClient = getStripeClient();
  const webhookSecret = functions.config().stripe.webhook_secret;
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  switch (event.type) {
  case "checkout.session.completed": {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const email = checkoutSession.customer_details?.email;
    const nome = checkoutSession.metadata?.firebase_nome;
    const telefone = checkoutSession.metadata?.firebase_telefone;
    const planoId = checkoutSession.metadata?.price_id;
    const stripeSubscriptionId = checkoutSession.subscription;

    if (
      !email || !nome || !telefone || !planoId || !stripeSubscriptionId
    ) {
      console.error(
        "Insufficient data in 'checkout.session.completed' event."
      );
      break;
    }

    try {
      const subscription = await stripeClient.subscriptions.retrieve(
        stripeSubscriptionId as string
      );

      const userRecord = await admin.auth().createUser({
        email: email,
        emailVerified: true,
        displayName: nome,
        phoneNumber: telefone,
      });

      const userRef = db.collection("users").doc(userRecord.uid);
      await userRef.set({
        nome: nome,
        email: email,
        telefone: telefone,
        planoId: planoId,
        statusAssinatura: "ativo",
        dataCadastro: admin.firestore.FieldValue.serverTimestamp(),
        proximoVencimento: admin.firestore.Timestamp.fromMillis(
          (subscription as any).current_period_end * 1000
        ),
        stripeCustomerId: subscription.customer as string,
        role: "user",
      });
      console.log(`✅ User created successfully: ${userRecord.uid}`);
    } catch (error) {
      console.error("🚨 Error creating user after payment: ", error);
    }
    break;
  }

  case "invoice.payment_succeeded": {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as any).subscription;

    if (
      invoice.billing_reason === "subscription_cycle" &&
      invoice.customer &&
      subscriptionId
    ) {
      const customerId = invoice.customer as string;
      const subscription = await stripeClient.subscriptions.retrieve(
        subscriptionId as string
      );

      const userQuery = await db
        .collection("users")
        .where("stripeCustomerId", "==", customerId)
        .limit(1)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({
          statusAssinatura: "ativo",
          proximoVencimento: admin.firestore.Timestamp.fromMillis(
            (subscription as any).current_period_end * 1000
          ),
        });
        console.log(`✅ Subscription renewed for user: ${userDoc.id}`);
      }
    }
    break;
  }

  case "invoice.payment_failed": {
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.customer) {
      const customerId = invoice.customer as string;
      const userQuery = await db
        .collection("users")
        .where("stripeCustomerId", "==", customerId)
        .limit(1)
        .get();
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        await userDoc.ref.update({statusAssinatura: "pagamento_atrasado"});
        console.log(`🚨 Payment failed for user: ${userDoc.id}`);
      }
    }
    break;
  }

  case "customer.subscription.deleted": {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const userQuery = await db
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();
    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({statusAssinatura: "inativo"});
      console.log(`🚫 Subscription canceled for user: ${userDoc.id}`);
    }
    break;
  }
  }

  res.status(200).send({received: true});
});

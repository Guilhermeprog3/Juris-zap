import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Inicializa o Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// --- INICIALIZAÇÃO PREGUIÇOSA DO STRIPE ---
let stripe: Stripe;

function getStripeClient() {
  if (!stripe) {
    stripe = new Stripe(functions.config().stripe.secret, {
      apiVersion: "2025-05-28.basil",
      typescript: true,
    });
  }
  return stripe;
}

// --- Tipagem para os dados recebidos ---
interface CreateCheckoutData {
  priceId: string;
  email: string;
  nome: string;
  telefone: string;
}

interface TopUpData {
    amount: number;
}

// 1. Cria a sessão de checkout para um novo usuário
export const createStripeCheckoutSession = functions.https.onCall(
  async (request: functions.https.CallableRequest<CreateCheckoutData>) => {
    const stripeClient = getStripeClient();
    const { priceId, email, nome, telefone } = request.data;

    if (!priceId || !email || !nome || !telefone) {
      throw new functions.https.HttpsError("invalid-argument", "Dados essenciais estão faltando.");
    }
    
    // Altere para as URLs do seu site em produção
    const successUrl = "http://localhost:3000/dashboard?payment_success=true";
    const cancelUrl = "http://localhost:3000/cadastro";

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email,
        metadata: {
          firebase_nome: nome,
          firebase_telefone: telefone,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return { sessionId: session.id };
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
      throw new functions.https.HttpsError("internal", "Não foi possível criar a sessão de pagamento.");
    }
  }
);

// 2. Recebe e processa webhooks do Stripe
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripeClient = getStripeClient();
  const webhookSecret = functions.config().stripe.webhook_secret;
  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"] as string, webhookSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const nome = session.metadata?.firebase_nome;
      const telefone = session.metadata?.firebase_telefone;
      const stripeSubscriptionId = session.subscription as string;

      if (!email || !nome || !telefone || !stripeSubscriptionId) break;

      try {
        const subscription = await stripeClient.subscriptions.retrieve(stripeSubscriptionId);
        const planoId = subscription.items.data[0]?.price.id;
        if (!planoId) break;
        
        const userRecord = await admin.auth().createUser({ email, emailVerified: true, displayName: nome, phoneNumber: telefone });
        
        await db.collection("users").doc(userRecord.uid).set({
          nome, email, telefone, planoId,
          statusAssinatura: "ativo",
          stripeCustomerId: subscription.customer as string,
          dataCadastro: admin.firestore.FieldValue.serverTimestamp(),
          proximoVencimento: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000),
          role: "user",
        });
      } catch (error) {
        console.error("Erro em checkout.session.completed:", error);
      }
      break;
    }
    case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;
        if (invoice.billing_reason === "subscription_cycle" && invoice.customer && subscriptionId) {
            const customerId = invoice.customer as string;
            const subscription = await stripeClient.subscriptions.retrieve(subscriptionId as string);
            const userQuery = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
            if (!userQuery.empty) {
                await userQuery.docs[0].ref.update({
                    statusAssinatura: "ativo",
                    proximoVencimento: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000),
                });
            }
        }
        break;
    }
    case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
            const customerId = invoice.customer as string;
            const userQuery = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
            if (!userQuery.empty) {
                await userQuery.docs[0].ref.update({ statusAssinatura: "pagamento_atrasado" });
            }
        }
        break;
    }
    case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userQuery = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
        if (!userQuery.empty) {
            await userQuery.docs[0].ref.update({ statusAssinatura: "inativo" });
        }
        break;
    }
  }
  res.status(200).send({ received: true });
});

// 3. Cria um link para o Portal do Cliente Stripe
export const createCustomerPortalSession = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado.");
  }
  
  const stripeClient = getStripeClient();
  const uid = request.auth.uid;
  const userDoc = await db.collection("users").doc(uid).get();
  const stripeCustomerId = userDoc.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new functions.https.HttpsError("not-found", "ID de cliente Stripe não encontrado.");
  }
  
  const returnUrl = "http://localhost:3000/dashboard/planos";

  const portalSession = await stripeClient.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return { url: portalSession.url };
});

// 4. Cria uma sessão para adicionar créditos
export const createTopUpSession = functions.https.onCall(async (request: functions.https.CallableRequest<TopUpData>) => {
    if (!request.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado.");
    }

    const stripeClient = getStripeClient();
    const uid = request.auth.uid;
    const { amount } = request.data;

    if (!amount || amount < 500) {
        throw new functions.https.HttpsError("invalid-argument", "O valor mínimo é de R$ 5,00.");
    }

    const userDoc = await db.collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;
    
    if (!stripeCustomerId) {
        throw new functions.https.HttpsError("not-found", "ID de cliente Stripe não encontrado.");
    }
    
    const successUrl = "http://localhost:3000/dashboard?topup_success=true";
    const cancelUrl = "http://localhost:3000/dashboard";

    const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: 'brl',
                product_data: { name: 'Créditos Adicionais' },
                unit_amount: amount,
            },
            quantity: 1,
        }],
        customer: stripeCustomerId,
        success_url: successUrl,
        cancel_url: cancelUrl,
    });
    return { sessionId: session.id };
});
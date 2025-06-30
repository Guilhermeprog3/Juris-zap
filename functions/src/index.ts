import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Inicialize o Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Define os segredos que serão usados. O Firebase irá buscá-los do Google Secret Manager.
const stripeSecret = functions.params.defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = functions.params.defineSecret("STRIPE_WEBHOOK_SECRET");

// A URL do seu site.
const siteUrl = process.env.SITE_URL || "http://localhost:3000"; 

interface CreateCheckoutData {
  priceId: string;
  email: string;
  nome: string;
  telefone: string;
}

interface TopUpData {
  amount: number;
}

// --- FUNÇÃO CORRIGIDA PARA V2 ---
export const createStripeCheckoutSession = functions.https.onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    // --- CORREÇÃO: Cliente Stripe inicializado diretamente ---
    const stripeClient = new Stripe(stripeSecret.value(), {
        apiVersion: "2024-04-10" as any,
        typescript: true,
    });

    const { priceId, email, nome, telefone } = request.data as CreateCheckoutData;

    if (!priceId || !email || !nome || !telefone) {
      throw new functions.https.HttpsError("invalid-argument", "Dados essenciais para o checkout estão faltando.");
    }

      const successUrl = `${siteUrl}/conta-criada`;
      const cancelUrl = `${siteUrl}/cadastro`;

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
      functions.logger.error("Erro ao criar sessão de checkout do Stripe:", error);
      throw new functions.https.HttpsError("internal", "Não foi possível criar a sessão de pagamento.");
    }
  }
);

// --- WEBHOOK CORRIGIDO PARA V2 ---
export const stripeWebhook = functions.https.onRequest(
  { secrets: [stripeSecret, stripeWebhookSecret] },
  async (req, res) => {
    // --- CORREÇÃO: Cliente Stripe inicializado diretamente ---
    const stripeClient = new Stripe(stripeSecret.value(), {
        apiVersion: "2024-04-10" as any,
        typescript: true,
    });
    
    const webhookSecretValue = stripeWebhookSecret.value();
    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"] as string, webhookSecretValue);
    } catch (err) {
      functions.logger.error("Erro na verificação do webhook do Stripe:", (err as Error).message);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }
    
    const dataObject: any = event.data.object;

    switch (event.type) {
      case "checkout.session.completed": {
        const email = dataObject.customer_details?.email;
        const nome = dataObject.metadata?.firebase_nome;
        const telefone = dataObject.metadata?.firebase_telefone;
        const stripeSubscriptionId = dataObject.subscription;

        if (!email || !nome || !telefone || !stripeSubscriptionId) {
          functions.logger.error("Webhook 'checkout.session.completed' com dados insuficientes.", { session: dataObject });
          break;
        }

        try {
          const subscription = await stripeClient.subscriptions.retrieve(stripeSubscriptionId);
          const planoId = subscription.items.data[0]?.price.id;

          if (!planoId) {
            functions.logger.error(`Não foi possível encontrar o planoId para a assinatura: ${stripeSubscriptionId}`);
            break;
          }
          
          // --- ADIÇÃO: Formata o número de telefone para o padrão E.164 ---
          const formattedPhoneNumber = `+55${telefone.replace(/\D/g, '')}`;

          const userRecord = await admin.auth().createUser({ 
            email, 
            emailVerified: true, 
            displayName: nome, 
            phoneNumber: formattedPhoneNumber // Usa o número formatado
          });
          
          await db.collection("users").doc(userRecord.uid).set({
            nome, email, telefone, planoId,
            statusAssinatura: "ativo",
            stripeCustomerId: subscription.customer as string,
            dataCadastro: admin.firestore.FieldValue.serverTimestamp(),
            proximoVencimento: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000),
            role: "user",
          });
          functions.logger.info(`Usuário criado com sucesso: ${userRecord.uid} para o cliente Stripe ${subscription.customer as string}`);

        } catch (error) {
          functions.logger.error("Erro ao processar 'checkout.session.completed':", error);
        }
        break;
      }
      // --- ADIÇÃO: Webhooks para gerenciar o ciclo de vida da assinatura ---
      case "invoice.payment_succeeded": {
        if (dataObject.billing_reason === "subscription_cycle" && dataObject.customer && dataObject.subscription) {
          try {
            const customerId = dataObject.customer;
            const subscription = await stripeClient.subscriptions.retrieve(dataObject.subscription);
            const userQuery = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();

            if (!userQuery.empty) {
              const userDoc = userQuery.docs[0];
              await userDoc.ref.update({
                statusAssinatura: "ativo",
                proximoVencimento: admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000),
              });
              functions.logger.info(`Assinatura renovada para o cliente Stripe ${customerId}`);
            }
          } catch (error) {
            functions.logger.error("Erro ao processar 'invoice.payment_succeeded':", error);
          }
        }
        break;
      }
      case "invoice.payment_failed":
      case "customer.subscription.deleted": {
        const customerId = dataObject.customer;
        const newStatus = event.type === 'invoice.payment_failed' ? 'pagamento_atrasado' : 'inativo';
        if (customerId) {
          try {
              const userQuery = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();
              if (!userQuery.empty) {
                  const userDoc = userQuery.docs[0];
                  await userDoc.ref.update({ statusAssinatura: newStatus });
                  functions.logger.info(`Status do cliente ${customerId} atualizado para ${newStatus}`);
              }
          } catch (error) {
              functions.logger.error(`Erro ao processar '${event.type}':`, error);
          }
        }
        break;
      }
    }

    res.status(200).send({ received: true });
});

export const createCustomerPortalSession = functions.https.onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError("unauthenticated", "O usuário precisa estar autenticado.");
    }
    
    // --- CORREÇÃO: Cliente Stripe inicializado diretamente ---
    const stripeClient = new Stripe(stripeSecret.value(), {
        apiVersion: "2024-04-10" as any,
        typescript: true,
    });

    const uid = request.auth.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new functions.https.HttpsError("not-found", "ID de cliente Stripe não encontrado.");
    }
    
    const returnUrl = `${siteUrl}/dashboard/planos`;

    try {
        const portalSession = await stripeClient.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: returnUrl,
        });
        return { url: portalSession.url };
    } catch (error) {
        functions.logger.error("Erro ao criar sessão do portal do cliente:", error);
        throw new functions.https.HttpsError("internal", "Não foi possível criar a sessão do portal do cliente.");
    }
});

export const createTopUpSession = functions.https.onCall(
  { secrets: [stripeSecret] },
  async (request) => {
      if (!request.auth) {
          throw new functions.https.HttpsError("unauthenticated", "O usuário precisa estar autenticado.");
      }

      // --- CORREÇÃO: Cliente Stripe inicializado diretamente ---
      const stripeClient = new Stripe(stripeSecret.value(), {
          apiVersion: "2024-04-10" as any,
          typescript: true,
      });

      const uid = request.auth.uid;
      const { amount } = request.data as TopUpData;

      if (typeof amount !== 'number' || amount < 500) { // R$ 5,00
          throw new functions.https.HttpsError("invalid-argument", "O valor mínimo para recarga é de R$ 5,00.");
      }

      const userDoc = await db.collection("users").doc(uid).get();
      const stripeCustomerId = userDoc.data()?.stripeCustomerId;
      
      if (!stripeCustomerId) {
          throw new functions.https.HttpsError("not-found", "ID de cliente Stripe não encontrado.");
      }
      
      const successUrl = `${siteUrl}/dashboard?topup_success=true`;
      const cancelUrl = `${siteUrl}/dashboard`;

      try {
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
      } catch (error) {
          functions.logger.error("Erro ao criar sessão de recarga:", error);
          throw new functions.https.HttpsError("internal", "Não foi possível criar a sessão de recarga.");
      }
  }
);

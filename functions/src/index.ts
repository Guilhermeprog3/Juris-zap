import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import cors from "cors";

try {
  admin.initializeApp();
} catch (e) {
  functions.logger.info("Firebase Admin já inicializado.");
}

const db = admin.firestore();
const auth = admin.auth();

const stripeSecret = functions.params.defineSecret("STRIPE_SECRET_KEY_TEST");
const stripeWebhookSecret = functions.params.defineSecret("STRIPE_WEBHOOK_SECRET_TEST");

const siteUrl = "http://localhost:3000";

const corsHandler = cors({
  origin: true,
});

const planosStripe = {
  basico: "price_1RudY8CSB0g3iOaxou4Ibkv6",
  essencial: "price_1RudXkCSB0g3iOaxMtn8SZcn",
  ultra: "price_1RudXPCSB0g3iOaxbP3QeNJg",
};

interface CreateCheckoutData {
  priceId: string;
  email: string;
  nome: string;
  telefone: string;
}

interface UpdatePhoneNumberData {
  uid: string;
  newPhoneNumber: string;
}

interface UpdatePhoneNumberResult {
  success: boolean;
  message?: string;
}

export const checkUserStatus = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        console.log("-> Iniciando checkUserStatus com o corpo:", req.body);
        if (req.method !== 'POST') {
            return res.status(405).send({ error: 'Method Not Allowed' });
        }
        const { email, telefone } = req.body;

        if (!email && !telefone) {
            functions.logger.error("checkUserStatus: Requisição sem email ou telefone.");
            return res.status(400).send({ error: { message: "E-mail ou telefone são obrigatórios." } });
        }

        try {
            const formattedPhoneNumber = telefone ? `+55${telefone.replace(/\D/g, '')}` : null;
            console.log("Verificando:", { email, formattedPhoneNumber });
            const promises = [];
            if (email) {
                promises.push(auth.getUserByEmail(email).then(() => 'emailAuth').catch(() => null));
                promises.push(db.collection('users').where('email', '==', email).limit(1).get().then(snap => !snap.empty ? 'emailStore' : null));
            }
            if (formattedPhoneNumber) {
                promises.push(auth.getUserByPhoneNumber(formattedPhoneNumber).then(() => 'phoneAuth').catch(() => null));
                promises.push(db.collection('users').where('telefone', '==', formattedPhoneNumber).limit(1).get().then(snap => !snap.empty ? 'phoneStore' : null));
            }

            const results = await Promise.all(promises);
            const foundBy = results.filter(r => r !== null);
            console.log("Resultados da verificação:", foundBy);

            if (foundBy.length > 0) {
                let message = "Já existe uma conta com este ";
                if (foundBy.includes('emailAuth') || foundBy.includes('emailStore')) message += "e-mail";
                if (foundBy.includes('phoneAuth') || foundBy.includes('phoneStore')) {
                    if (message.includes("e-mail")) message += " e ";
                    message += "telefone";
                }
                message += ". Por favor, faça login.";
                
                console.log("Usuário encontrado. Mensagem:", message);
                return res.status(200).send({ exists: true, message: message });
            }
            
            console.log("Nenhum usuário existente encontrado.");
            return res.status(200).send({ exists: false });

        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                console.log("Usuário não encontrado no Auth, o que é esperado para novos usuários.");
                return res.status(200).send({ exists: false });
            }
            functions.logger.error("Erro inesperado na função checkUserStatus:", error);
            return res.status(500).send({ error: { message: "Erro interno ao verificar seus dados." } });
        }
    });
});

export const updatePhoneNumber = functions.https.onCall(
  async (request): Promise<UpdatePhoneNumberResult> => {
    if (!request.auth) throw new functions.https.HttpsError("unauthenticated", "O usuário precisa estar autenticado.");

    const { uid, newPhoneNumber } = request.data as UpdatePhoneNumberData;

    if (request.auth.uid !== uid) throw new functions.https.HttpsError("permission-denied", "Você não tem permissão para alterar o telefone de outro usuário.");
    if (!uid || !newPhoneNumber) throw new functions.https.HttpsError("invalid-argument", "UID do usuário e novo número de telefone são obrigatórios.");
    
    const formattedNewPhoneNumber = `+55${newPhoneNumber.replace(/\D/g, '')}`;

    try {
      await auth.updateUser(uid, { phoneNumber: formattedNewPhoneNumber });
      await db.collection("users").doc(uid).update({ telefone: formattedNewPhoneNumber });
      functions.logger.info(`Telefone atualizado com sucesso para UID: ${uid}`);
      return { success: true, message: "Número de telefone atualizado com sucesso." };
    } catch (error: any) {
      functions.logger.error("Erro ao atualizar o número de telefone:", error);
      if (error.code === 'auth/invalid-phone-number') throw new functions.https.HttpsError("invalid-argument", "O número de telefone fornecido é inválido.");
      if (error.code === 'auth/phone-number-already-exists') throw new functions.https.HttpsError("already-exists", "O número de telefone já está em uso por outra conta.");
      throw new functions.https.HttpsError("internal", "Não foi possível atualizar o número de telefone.");
    }
  }
);

export const createStripeCheckoutSession = functions.https.onCall(
  { secrets: [stripeSecret], region: "us-central1" },
  async (request) => {
    const { priceId, email, nome, telefone } = request.data as CreateCheckoutData;
    
    if (!priceId || !email || !nome || !telefone) throw new functions.https.HttpsError("invalid-argument", "Dados essenciais estão faltando.");
    
    const secretValue = stripeSecret.value();
    if (!secretValue) throw new functions.https.HttpsError("internal", "Configuração do servidor incompleta.");

    try {
      const stripeClient = new Stripe(secretValue, { apiVersion: "2025-05-28.basil" });
      const successUrl = `${siteUrl}/conta-criada`;
      const cancelUrl = `${siteUrl}/cadastro`;

      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email,
        metadata: { firebase_nome: nome, firebase_telefone: telefone },
        success_url: successUrl,
        cancel_url: cancelUrl,
      };

      if (priceId === planosStripe.essencial) {
        console.log(`Aplicando 7 dias de teste para o priceId: ${priceId}`);
        sessionOptions.subscription_data = { trial_period_days: 7 };
      }

      const session = await stripeClient.checkout.sessions.create(sessionOptions);
      console.log("Sessão de checkout criada com sucesso:", session.id);
      return { sessionId: session.id };
    } catch (error: any) {
      functions.logger.error("Erro CRÍTICO ao criar sessão de checkout do Stripe:", error);
      throw new functions.https.HttpsError("internal", `Erro inesperado: ${error.message}`);
    }
  }
);

export const createCustomerPortalSession = functions.https.onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    if (!request.auth) throw new functions.https.HttpsError("unauthenticated", "O usuário precisa estar autenticado.");
    
    const stripeClient = new Stripe(stripeSecret.value(), { apiVersion: "2025-05-28.basil" });
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) throw new functions.https.HttpsError("not-found", "ID de cliente Stripe não encontrado.");
    
    try {
        const portalSession = await stripeClient.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: `${siteUrl}/dashboard`,
        });
        return { url: portalSession.url };
    } catch (error) {
        functions.logger.error("Erro ao criar sessão do portal do cliente:", error);
        throw new functions.https.HttpsError("internal", "Não foi possível criar a sessão do portal.");
    }
});

export const stripeWebhook = functions.https.onRequest(
  { secrets: [stripeSecret, stripeWebhookSecret] },
  async (req, res) => {
    const stripeClient = new Stripe(stripeSecret.value(), { apiVersion: "2025-05-28.basil" });
    const webhookSecretValue = stripeWebhookSecret.value();
    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"] as string, webhookSecretValue);
    } catch (err) {
      functions.logger.error("!!! Erro na verificação do webhook do Stripe:", (err as Error).message);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }
    
    const dataObject: any = event.data.object;
    console.log(`Webhook recebido: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("-> Iniciando processamento de 'checkout.session.completed'", { sessionId: dataObject.id });
        console.log("Payload completo:", JSON.stringify(dataObject, null, 2));

        const email = dataObject.customer_details?.email;
        const nome = dataObject.metadata?.firebase_nome;
        const telefone = dataObject.metadata?.firebase_telefone;
        const stripeSubscriptionId = dataObject.subscription;

        console.log("Metadados extraídos:", { email, nome, telefone, stripeSubscriptionId });

        if (!email || !nome || !telefone || !stripeSubscriptionId) {
          functions.logger.error("Webhook 'checkout.session.completed' com dados insuficientes.", { session: dataObject });
          break;
        }

        try {
          const subscription = await stripeClient.subscriptions.retrieve(stripeSubscriptionId);
          const stripePriceId = subscription.items.data[0]?.price.id;
          
          const stripePlanToId = Object.fromEntries(Object.entries(planosStripe).map(([key, value]) => [value, key]));
          const planoId = stripePlanToId[stripePriceId] || "desconhecido";

          const trialEndTimestamp = subscription.trial_end ? admin.firestore.Timestamp.fromMillis(subscription.trial_end * 1000) : null;
          
          // CORREÇÃO: Usa trial_end se current_period_end for nulo.
          const proximoVencimentoTimestamp = (subscription as any).current_period_end
                ? admin.firestore.Timestamp.fromMillis((subscription as any).current_period_end * 1000)
                : trialEndTimestamp;

          console.log("Dados da assinatura:", { stripePriceId, planoIdMapeado: planoId, trialEnd: trialEndTimestamp, proximoVencimento: proximoVencimentoTimestamp });

          if (!stripePriceId) {
            functions.logger.error(`Não foi possível encontrar o priceId para a assinatura: ${stripeSubscriptionId}`);
            break;
          }

          const formattedPhoneNumber = `+55${telefone.replace(/\D/g, '')}`;

          console.log("Tentando criar usuário no Firebase Auth...", { email, nome, telefone: formattedPhoneNumber });
          const userRecord = await admin.auth().createUser({ email, emailVerified: true, displayName: nome, phoneNumber: formattedPhoneNumber });
          console.log(`Usuário criado no Auth com UID: ${userRecord.uid}`);
          
          const userDocument = {
            nome, email, telefone: formattedPhoneNumber, planoId,
            statusAssinatura: "ativo",
            stripeCustomerId: subscription.customer as string,
            dataCadastro: admin.firestore.FieldValue.serverTimestamp(),
            proximoVencimento: proximoVencimentoTimestamp,
            trial_end: trialEndTimestamp,
            role: "user",
          };

          console.log("Tentando salvar o seguinte documento no Firestore:", { uid: userRecord.uid, data: userDocument });
          await db.collection("users").doc(userRecord.uid).set(userDocument);
          console.log("Documento do usuário salvo com sucesso no Firestore.");

          const actionCodeSettings = { url: `${siteUrl}/login`, handleCodeInApp: false };
          
          console.log("Gerando link de redefinição de senha...");
          await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
          console.log("Link de redefinição de senha gerado com sucesso.");
          
          functions.logger.info(`Processo de criação do usuário ${userRecord.uid} concluído com sucesso.`);

        } catch (error) {
          functions.logger.error("ERRO DETALHADO ao processar 'checkout.session.completed':", error);
        }
        break;
      }
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

// Funções administrativas
export const toggleUserStatus = functions.https.onCall(
  async (request) => {
    if (request.auth?.token.admin !== true) {
      throw new functions.https.HttpsError("permission-denied", "Apenas administradores podem executar esta ação.");
    }

    const { uid, disabled } = request.data;
    if (!uid || typeof disabled !== 'boolean') {
        throw new functions.https.HttpsError("invalid-argument", "UID do usuário e o status 'disabled' são obrigatórios.");
    }

    try {
        await admin.auth().updateUser(uid, { disabled });
        await db.collection("users").doc(uid).update({ disabled: disabled });
        functions.logger.info(`Status de autenticação do usuário ${uid} alterado para disabled: ${disabled}`);
        return { success: true, message: `Usuário ${disabled ? 'desativado' : 'ativado'} com sucesso.` };
    } catch (error) {
        functions.logger.error(`Erro ao alterar o status do usuário ${uid}:`, error);
        throw new functions.https.HttpsError("internal", "Não foi possível alterar o status do usuário.");
    }
});

export const sendAnnouncementEmail = functions.https.onCall(
  async (request) => {
    if (request.auth?.token.admin !== true) {
      throw new functions.https.HttpsError("permission-denied", "Apenas administradores podem executar esta ação.");
    }

    const { subject, body } = request.data;
    if (!subject || !body) {
        throw new functions.https.HttpsError("invalid-argument", "Assunto e corpo do e-mail são obrigatórios.");
    }

    try {
        const usersSnapshot = await db.collection('users').where('role', '==', 'user').get();
        const emails = usersSnapshot.docs.map(doc => doc.data().email);

        functions.logger.info(`Simulando envio de e-mail para ${emails.length} usuários.`);
        functions.logger.info("Assunto:", subject);

        return { success: true, message: `Anúncio enviado para ${emails.length} usuários.` };
    } catch (error) {
        functions.logger.error("Erro ao enviar anúncio por e-mail:", error);
        throw new functions.https.HttpsError("internal", "Falha ao enviar o anúncio.");
    }
});

export const setAdminClaim = functions.https.onCall(async (request) => {
    if (request.auth?.token.admin !== true) {
        throw new functions.https.HttpsError("permission-denied", "Apenas administradores podem promover outros usuários.");
    }

    const { uid } = request.data;
    if (!uid) {
        throw new functions.https.HttpsError("invalid-argument", "O UID do usuário é obrigatório.");
    }

    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        await db.collection("users").doc(uid).update({ role: "admin" });

        functions.logger.info(`Usuário ${uid} foi promovido a administrador por ${request.auth.uid}`);
        return { success: true, message: "Usuário promovido a administrador com sucesso!" };
    } catch (error) {
        functions.logger.error(`Erro ao promover o usuário ${uid} a administrador:`, error);
        throw new functions.https.HttpsError("internal", "Não foi possível promover o usuário.");
    }
});
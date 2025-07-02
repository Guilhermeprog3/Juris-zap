import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

const stripeSecret = functions.params.defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = functions.params.defineSecret("STRIPE_WEBHOOK_SECRET");

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

interface UpdatePhoneNumberData {
  uid: string;
  newPhoneNumber: string;
}

interface UpdatePhoneNumberResult {
  success: boolean;
  message?: string;
}

export const updatePhoneNumber = functions.https.onCall(
  async (request): Promise<UpdatePhoneNumberResult> => {
    if (!request.auth) {
      throw new functions.https.HttpsError("unauthenticated", "O usuário precisa estar autenticado.");
    }

    const { uid, newPhoneNumber } = request.data as UpdatePhoneNumberData;

    if (request.auth.uid !== uid) {
      throw new functions.https.HttpsError("permission-denied", "Você não tem permissão para alterar o telefone de outro usuário.");
    }

    if (!uid || !newPhoneNumber) {
      throw new functions.https.HttpsError("invalid-argument", "UID do usuário e novo número de telefone são obrigatórios.");
    }
    const formattedNewPhoneNumber = `+55${newPhoneNumber.replace(/\D/g, '')}`;

    try {
      await auth.updateUser(uid, {
        phoneNumber: formattedNewPhoneNumber,
      });
      functions.logger.info(`Telefone atualizado no Auth para UID: ${uid} para ${formattedNewPhoneNumber}`);

      const userDocRef = db.collection("users").doc(uid);
      await userDocRef.update({
        telefone: formattedNewPhoneNumber,
      });
      functions.logger.info(`Telefone atualizado no Firestore para UID: ${uid}`);

      return { success: true, message: "Número de telefone atualizado com sucesso." };

    } catch (error: any) {
      functions.logger.error("Erro ao atualizar o número de telefone:", error);
      if (error.code === 'auth/invalid-phone-number') {
        throw new functions.https.HttpsError("invalid-argument", "O número de telefone fornecido é inválido.");
      }
      if (error.code === 'auth/phone-number-already-exists') {
        throw new functions.https.HttpsError("already-exists", "O número de telefone já está em uso por outra conta.");
      }
      throw new functions.https.HttpsError("internal", "Não foi possível atualizar o número de telefone. Tente novamente mais tarde.");
    }
  }
);

export const createStripeCheckoutSession = functions.https.onCall(
  { secrets: [stripeSecret] },
  async (request) => {
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
        payment_method_types: ["card","pix"],
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

export const stripeWebhook = functions.https.onRequest(
  { secrets: [stripeSecret, stripeWebhookSecret] },
  async (req, res) => {
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

          const formattedPhoneNumber = `+55${telefone.replace(/\D/g, '')}`;

          const userRecord = await admin.auth().createUser({ 
            email, 
            emailVerified: true,
            displayName: nome, 
            phoneNumber: formattedPhoneNumber
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
    
    const returnUrl = `${siteUrl}/dashboard`;

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

      const stripeClient = new Stripe(stripeSecret.value(), {
          apiVersion: "2024-04-10" as any,
          typescript: true,
      });

      const uid = request.auth.uid;
      const { amount } = request.data as TopUpData;

      if (typeof amount !== 'number' || amount < 500) { 
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

export const checkUserStatus = functions.https.onCall(async (data) => {
  const { email, telefone } = data.data;
  functions.logger.info("Dados recebidos na função checkUserStatus:", data);

  if (!email && !telefone) {
    throw new functions.https.HttpsError("invalid-argument", "E-mail ou telefone são obrigatórios para a verificação.");
  }

  try {
    let userRecord = null;
    let emailExists = false;
    let phoneExists = false;
    let existenceMessage = "";
    const formattedPhoneNumber = telefone ? `+559${telefone.replace(/\D/g, '')}` : null;

    if (email) {
      functions.logger.info(`checkUserStatus: Tentando buscar por e-mail: ${email}`);
      try {
        userRecord = await auth.getUserByEmail(email);
        emailExists = true;
      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          functions.logger.error("Erro ao verificar email no Firebase Auth:", error);
          throw new functions.https.HttpsError("internal", "Erro ao verificar o email.");
        }
      }
    }

    if (!userRecord && formattedPhoneNumber) { 
      functions.logger.info(`checkUserStatus: Tentando buscar por telefone 11111(como provedor): ${formattedPhoneNumber}`);
      try {
        userRecord = await auth.getUserByPhoneNumber(formattedPhoneNumber);
        phoneExists = true;
      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          functions.logger.error("Erro ao verificar telefone (provedor) no Firebase Auth:", error);
          throw new functions.https.HttpsError("internal", "Erro ao verificar o telefone.");
        }
      }
    } else if (userRecord && formattedPhoneNumber) { 
        functions.logger.info(`checkUserStatus: Verificando se o telefone ${formattedPhoneNumber} corresponde ao userRecord existente.`);
        if (userRecord.phoneNumber === formattedPhoneNumber) {
            phoneExists = true;
        }
    }


    if (emailExists && phoneExists) {
        existenceMessage = "Já existe uma conta com este e-mail e telefone.";
    } else if (emailExists) {
        existenceMessage = "Já existe uma conta com este e-mail.";
    } else if (phoneExists) {
        existenceMessage = "Já existe uma conta com este telefone.";
    }

    if (!userRecord) {
        functions.logger.info("checkUserStatus: Usuário não encontrado no Firebase Auth.");
        return { exists: false, canUseAI: false, plano: null, message: "Usuário não encontrado." };
    }

    functions.logger.info(`checkUserStatus: Usuário encontrado no Auth (${userRecord.uid}). Buscando no Firestore.`);
    const userDoc = await db.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists) {
        functions.logger.info(`checkUserStatus: Documento do usuário ${userRecord.uid} não encontrado no Firestore.`);
        return { exists: true, canUseAI: false, plano: null, message: "Dados de assinatura do usuário não encontrados." };
    }

    const userData = userDoc.data();
    const statusAssinatura = userData?.statusAssinatura;
    const planoId = userData?.planoId;

    if (statusAssinatura === 'pagamento_atrasado' || statusAssinatura === 'inativo') {
        functions.logger.info(`checkUserStatus: Assinatura do usuário ${userRecord.uid} está ${statusAssinatura}.`);
        return {
            exists: true,
            canUseAI: false,
            plano: planoId,
            message: "Acesso bloqueado. Assinatura pendente ou inativa."
        };
    }

    functions.logger.info(`checkUserStatus: Usuário ${userRecord.uid} ativo. Acesso liberado.`);
    return {
        exists: true,
        canUseAI: true,
        plano: planoId,
        message: existenceMessage || "Usuário verificado com sucesso."
    };
  } catch (error) {
    functions.logger.error("Erro inesperado na função checkUserStatus:", error);
    throw new functions.https.HttpsError("internal", "Erro interno ao verificar os dados do usuário.");
  }
});
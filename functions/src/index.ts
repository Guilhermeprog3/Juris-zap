// File: functions/src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Inicializa o Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// ATENÇÃO: Configure suas chaves no ambiente do Firebase para segurança.
// Use os comandos no terminal na raiz do seu projeto:
// firebase functions:config:set stripe.secret="sk_test_SUA_CHAVE_SECRETA"
// firebase functions:config:set stripe.webhook_secret="whsec_SEU_WEBHOOK_SECRET"
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2024-06-20",
  typescript: true,
});

/**
 * Cria uma sessão de Checkout do Stripe para um novo usuário.
 */
export const createStripeCheckoutSession = functions.https.onCall(async (data) => {
    // Tipamos o 'data' para que o TypeScript saiba quais propriedades esperar.
    const { priceId, email, nome, telefone } = data as unknown as {
      priceId: string;
      email: string;
      nome: string;
      telefone: string;
    };

    if (!priceId || !email || !nome || !telefone) {
        throw new functions.https.HttpsError("invalid-argument", "Dados essenciais (plano, email, nome, telefone) estão faltando.");
    }
    
    // Altere para sua URL de produção quando for para o ar
    const successUrl = 'http://localhost:3000/dashboard?payment_success=true'; 
    const cancelUrl = 'http://localhost:3000/planos';
    
    try {
        const session = await stripe.checkout.sessions.create({
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

        return { sessionId: session.id };
    } catch (error) {
        console.error("Erro ao criar sessão de checkout no Stripe:", error);
        throw new functions.https.HttpsError("internal", "Não foi possível criar a sessão de pagamento.");
    }
});


/**
 * Webhook para receber e processar todos os eventos vindos do Stripe.
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
    const webhookSecret = functions.config().stripe.webhook_secret;
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    } catch (err) {
        console.error("⚠️  Verificação da assinatura do webhook falhou.", err);
        res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        return;
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            const email = checkoutSession.customer_details?.email;
            const nome = checkoutSession.metadata?.firebase_nome;
            const telefone = checkoutSession.metadata?.firebase_telefone;
            const planoId = checkoutSession.metadata?.price_id;
            
            // CORREÇÃO: Verificamos se a propriedade 'subscription' existe antes de usá-la.
            const stripeSubscriptionId = checkoutSession.subscription;
            
            if (!email || !nome || !telefone || !planoId || !stripeSubscriptionId) {
                console.error("Dados insuficientes no evento 'checkout.session.completed'.");
                break;
            }

            try {
                // A API do Stripe retorna o ID da assinatura como string.
                const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string);

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
                    statusAssinatura: 'ativo',
                    dataCadastro: admin.firestore.FieldValue.serverTimestamp(),
                    proximoVencimento: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
                    stripeCustomerId: subscription.customer as string,
                    role: 'user',
                });
                console.log(`✅ Usuário criado com sucesso: ${userRecord.uid}`);
            } catch (error) {
                console.error("🚨 Erro ao criar usuário após pagamento: ", error);
            }
            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            // CORREÇÃO: Verificamos se 'invoice.subscription' não é nulo antes de usá-lo.
            if (invoice.billing_reason === 'subscription_cycle' && invoice.customer && invoice.subscription) {
                const customerId = invoice.customer as string;
                // A API do Stripe retorna o ID da assinatura como string.
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
                
                const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
                if (!userQuery.empty) {
                    const userDoc = userQuery.docs[0];
                    await userDoc.ref.update({
                        statusAssinatura: 'ativo',
                        // CORREÇÃO: Acessamos a propriedade 'current_period_end' do objeto subscription retornado pela API.
                        proximoVencimento: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
                    });
                    console.log(`✅ Assinatura renovada para o usuário: ${userDoc.id}`);
                }
            }
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.customer) {
                const customerId = invoice.customer as string;
                const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
                if (!userQuery.empty) {
                    const userDoc = userQuery.docs[0];
                    await userDoc.ref.update({ statusAssinatura: 'pagamento_atrasado' });
                    console.log(`🚨 Falha no pagamento para o usuário: ${userDoc.id}`);
                }
            }
            break;
        }

        case 'customer.subscription.deleted': {
             const subscription = event.data.object as Stripe.Subscription;
             const customerId = subscription.customer as string;
             const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
             if (!userQuery.empty) {
                const userDoc = userQuery.docs[0];
                await userDoc.ref.update({ statusAssinatura: 'inativo' });
                 console.log(`🚫 Assinatura cancelada para o usuário: ${userDoc.id}`);
             }
             break;
        }
    }

    res.status(200).send({ received: true });
});


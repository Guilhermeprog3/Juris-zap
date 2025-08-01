const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); 

const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error('ERRO: Forneça o e-mail do usuário que você quer tornar admin.');
  console.log('Uso: node set-admin.js seu-email@example.com');
  process.exit(1);
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdmin() {
  try {
    const user = await admin.auth().getUserByEmail(adminEmail);

    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    const db = admin.firestore();
    await db.collection('users').doc(user.uid).update({ role: 'admin' });

    console.log(`Sucesso! ${adminEmail} agora é um administrador.`);
    console.log('IMPORTANTE: Faça logout e login novamente no aplicativo para que as permissões sejam atualizadas.');

  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }
  process.exit();
}

setAdmin();
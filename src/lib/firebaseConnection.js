import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

const firestoreDB = admin.firestore();

export { firestoreDB };

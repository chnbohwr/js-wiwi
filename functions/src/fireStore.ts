import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
//*important: trigger firestore  improve cold start performance
admin.firestore().listCollections().then().catch();
export default admin.firestore();
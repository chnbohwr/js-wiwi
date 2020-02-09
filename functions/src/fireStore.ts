console.time('initial firestore');
import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
console.timeEnd('initial firestore');
export default admin.firestore();
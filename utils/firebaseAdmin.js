import admin from 'firebase-admin';
import serviceAccount from './loveme-5673e-firebase-adminsdk-z095f-b2b7d46d69.json' assert { type: 'json' };

admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
});

export default admin;

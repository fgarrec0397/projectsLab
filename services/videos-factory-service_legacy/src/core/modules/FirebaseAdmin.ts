import type { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin";

import serviceAccount from "../../../credentials/firebase-serviceAccountKey.json";

export class FirebaseAdmin {
    private static instance: admin.app.App;

    public static getModule(): admin.app.App {
        if (!FirebaseAdmin.instance) {
            FirebaseAdmin.instance = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as ServiceAccount),
            });
        }
        return FirebaseAdmin.instance;
    }
}

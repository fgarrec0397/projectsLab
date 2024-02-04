import { Injectable } from "@nestjs/common";
import type { ServiceAccount } from "firebase-admin";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseAdmin {
    private static instance: admin.app.App;

    private db = admin.firestore();

    public static getModule(): admin.app.App {
        if (!FirebaseAdmin.instance && admin.apps.length === 0) {
            const serviceAccount = require("../../credentials/firebase-serviceAccountKey.json");

            FirebaseAdmin.instance = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as ServiceAccount),
            });
        }

        return FirebaseAdmin.instance;
    }

    async getDB() {
        return this.db;
    }
}

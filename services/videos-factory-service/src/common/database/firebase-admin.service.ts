import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
    private defaultApp: admin.app.App;

    onModuleInit() {
        const serviceAccount = require("../../../credentials/firebase-serviceAccountKey.json");

        this.defaultApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    getAdmin() {
        return this.defaultApp;
    }
}

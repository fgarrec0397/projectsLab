import { Module, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

@Module({})
export class FirebaseAdminModule implements OnModuleInit {
    onModuleInit() {
        const serviceAccount = require("../../credentials/firebase-serviceAccountKey.json");

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
}

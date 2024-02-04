import { Module, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "./firebase.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, FirebaseStrategy],
})
export class AuthModule implements OnModuleInit {
    onModuleInit() {
        const serviceAccount = require("../../../credentials/firebase-serviceAccountKey.json");

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
}

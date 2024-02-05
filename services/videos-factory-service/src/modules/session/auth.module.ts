import { Module, OnModuleInit } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import * as admin from "firebase-admin";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "./firebase.strategy";

@Module({
    imports: [PassportModule.register({ session: true })],
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

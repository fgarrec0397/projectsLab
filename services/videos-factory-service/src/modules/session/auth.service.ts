import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class AuthService {
    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        console.log(idToken, "idToken");

        try {
            return await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            console.log(error, "error in AuthService");

            throw new Error("Unable to verify ID token");
        }
    }
}

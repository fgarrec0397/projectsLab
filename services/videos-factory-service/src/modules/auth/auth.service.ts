import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class AuthService {
    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        try {
            return await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            console.log(error, "error in AuthService");

            throw new Error("Unable to verify ID token");
        }
    }

    async revokeRefreshTokens(uid: string): Promise<void> {
        try {
            await admin.auth().revokeRefreshTokens(uid);
        } catch (error) {
            throw new Error("Could not revoke tokens");
        }
    }
}

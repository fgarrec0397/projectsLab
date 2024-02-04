import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as admin from "firebase-admin";
import { Strategy } from "passport-custom";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, "firebase-auth") {
    async validate(request: Request): Promise<any> {
        const idToken = (request.body as any).idToken;
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const user = { uid: decodedToken.uid };
            return user;
        } catch (error) {
            throw new HttpException(
                { statusCode: HttpStatus.UNAUTHORIZED, message: "You must be signed in." },
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}

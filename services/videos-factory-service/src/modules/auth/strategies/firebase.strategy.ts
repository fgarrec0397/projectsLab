import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-custom";

import { AuthService } from "../auth.service";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, "firebase-auth") {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(request: Request): Promise<any> {
        const idToken = request.headers.authorization?.split("Bearer ")[1];

        if (!idToken) throw new UnauthorizedException("ID token is missing");

        try {
            const decodedToken = await this.authService.verifyIdToken(idToken);

            const user = { id: decodedToken.uid };

            request.userId = user.id;

            return user;
        } catch (error) {
            throw new HttpException(
                { statusCode: HttpStatus.UNAUTHORIZED, message: "You must be signed in." },
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}

import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sessionLogin")
    async createSession(
        @Body("idToken") idToken: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const firebaseUser = await this.authService.verifyIdToken(idToken);
            req.session.userId = firebaseUser.uid;

            res.status(200).json({ success: true });
        } catch (error) {
            console.log(error, "error");

            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }
}

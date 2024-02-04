import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sessionLogin")
    async createSession(@Body("idToken") idToken: string, @Req() req: Request) {
        try {
            const firebaseUser = await this.authService.verifyIdToken(idToken);
            req.session.uid = firebaseUser.uid;

            return { success: true };
        } catch (error) {
            console.log(error, "error");

            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }

    @Post("logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const uid = req.session.uid;

            await this.authService.revokeRefreshTokens(uid);

            req.session.destroy((err) => {
                console.log(err, "err");

                if (err) {
                    throw new HttpException("Logout failed", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                res.clearCookie("createify.session");

                res.status(200).json({ success: true });
            });
        } catch (error) {
            console.log(error, "error");

            throw new HttpException("Logout failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { Public } from "./decorators/use-public.guard";

/**
 * The sign in / sign out endpoints are technically useless since Firebase already sign the token for us.
 * However, we will let it there for any future use
 */

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sessionLogin")
    @Public()
    async createSession(@Body("idToken") idToken: string, @Req() req: Request) {
        console.log("createSession");

        try {
            const firebaseUser = await this.authService.verifyIdToken(idToken);
            console.log(firebaseUser, "firebaseUser");

            (req.session as any).uid = firebaseUser.uid;

            return { success: true };
        } catch (error) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }

    @Post("logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const uid = (req.session as any).uid;

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

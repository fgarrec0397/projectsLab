import { NextFunction, Request, Response } from "express";

import { FirebaseAdmin } from "../modules/FirebaseAdmin";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const admin = FirebaseAdmin.getModule();
    const sessionCookie = req.cookies.session || "";
    try {
        const decodedClaims = await admin
            .auth()
            .verifySessionCookie(sessionCookie, true /** checkRevoked */);
        (req as any).user = decodedClaims;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
};

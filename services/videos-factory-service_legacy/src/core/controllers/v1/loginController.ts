import type { Request, Response } from "express";

import { FirebaseAdmin } from "../../modules/FirebaseAdmin";

const post = async (request: Request, result: Response) => {
    const admin = FirebaseAdmin.getModule();
    const idToken = request.body?.idToken;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

        // Optionally create a session cookie
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        // Set cookie policy for security
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true /* Set to false if testing on http */,
        };
        result.cookie("session", sessionCookie, options);

        result.status(200).send({ status: "success" });
    } catch (error) {
        result.status(401).send("Unauthorized Request");
    }
};

export default {
    post,
};

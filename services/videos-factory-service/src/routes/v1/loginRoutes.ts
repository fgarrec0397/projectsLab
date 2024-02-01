import { Router } from "express";

import loginController from "../../core/controllers/v1/loginController";

const loginRoutes = () => {
    const router = Router();

    router.post("/login", loginController.post);

    return router;
};

export default loginRoutes;

import { Router } from "express";

import okController from "../../core/controllers/v1/okController";

const okRoutes = () => {
    const router = Router();

    router.get("/", okController.get);

    return router;
};

export default okRoutes;

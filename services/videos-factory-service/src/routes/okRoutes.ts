import { Router } from "express";

import okV1Controller from "../controllers/okV1Controller";

const okRoutes = (version: number) => {
    const router = Router();

    if (version === 1) {
        router.get("/", okV1Controller.get);
    }

    return router;
};

export default okRoutes;

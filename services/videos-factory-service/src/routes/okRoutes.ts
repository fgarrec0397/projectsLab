import { Router } from "express";

import okController from "../controllers/okController";

const okRoutes = () => {
    const router = Router();

    router.get("/", okController.get);

    return router;
};

export default okRoutes;

import { Router } from "express";

import videoController from "../../controllers/v1/videoController";

const okRoutes = () => {
    const router = Router();

    router.get("/", videoController.get);

    return router;
};

export default okRoutes;

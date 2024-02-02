import { Router } from "express";

import { checkAuth } from "../../core/middlewares/checkAuth";
import { Video } from "../../video/Video";

const videoController = Video.instantiateController();

const videoRoutes = () => {
    const router = Router();

    router.get("/", checkAuth, videoController.get);

    return router;
};

export default videoRoutes;

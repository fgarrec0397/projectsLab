import { Router } from "express";

import { Video } from "../../video/Video";

const videoController = Video.instantiateController();

const videoRoutes = () => {
    const router = Router();

    router.get("/", videoController.get);

    return router;
};

export default videoRoutes;

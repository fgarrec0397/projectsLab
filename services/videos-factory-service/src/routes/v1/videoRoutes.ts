import { Router } from "express";

import { Video } from "../../video/Video";

const videoController = Video.instantiateController();

const videoRoutes = () => {
    const router = Router();

    router.get("/", videoController.get); // TODO - the undefined issue probably comes from here. Probably same issue as ElementComponentFactory.createElementComponent line 26

    return router;
};

export default videoRoutes;

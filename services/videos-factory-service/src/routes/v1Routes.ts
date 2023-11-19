import { Router } from "express";

import okRoutes from "./v1/okRoutes";
import videoRoutes from "./v1/videoRoutes";

const routes = () => {
    const router = Router();

    router.use("/ok", okRoutes());
    router.use("/video", videoRoutes());

    return router;
};

export default routes;

import { Router } from "express";

import okRoutes from "./okRoutes";

const routes = () => {
    const router = Router();

    router.use("/ok", okRoutes());

    return router;
};

export default routes;

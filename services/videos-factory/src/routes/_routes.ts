import { Router } from "express";
import audioToTextRoutes from "./audioToTextRoutes";
import okRoutes from "./okRoutes";

const routes = () => {
    const router = Router();

    router.use("/ok", okRoutes());
    router.use("/audioToText", audioToTextRoutes());

    return router;
};

export default routes;

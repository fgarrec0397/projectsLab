import { Router } from "express";
import audioToTextRoutes from "./audioToTextRoutes";

const routes = () => {
    const router = Router();

    router.use("/audioToText", audioToTextRoutes());

    return router;
};

export default routes;

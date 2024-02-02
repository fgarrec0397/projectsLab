import { Router } from "express";

import v1Routes from "./v1Routes";

const routes = () => {
    const router = Router();

    router.use("/v1", v1Routes());

    return router;
};

export default routes;

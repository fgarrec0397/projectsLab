import { Router } from "express";

import audioToTextController from "../controllers/audioToTextController";

const audioToTextRoutes = () => {
    const router = Router();

    router.post("/", audioToTextController.post);

    return router;
};

export default audioToTextRoutes;

import express from "express";
import audioToTextController from "../controllers/audioToTextController";

const audioToTextRoutes = () => {
    const router = express.Router();

    router.post("/", audioToTextController.post);

    return router;
};

export default audioToTextRoutes;

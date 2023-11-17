import express from "express";
import okController from "../controllers/okController";

const okRoutes = () => {
    const router = express.Router();

    router.get("/", okController.get);

    return router;
};

export default okRoutes;

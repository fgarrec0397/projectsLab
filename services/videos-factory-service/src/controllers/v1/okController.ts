import { Request, Response } from "express";

const get = async (request: Request, result: Response) => {
    result.status(200).json({ result: "videos-factory-service is up and running" });
};

export default {
    get,
};

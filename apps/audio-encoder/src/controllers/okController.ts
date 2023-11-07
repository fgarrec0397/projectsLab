import { Request, Response } from "express";

const get = async (request: Request, result: Response) => {
    result.status(200).json({ result: "The app is up and running" });
};

export default {
    get,
};

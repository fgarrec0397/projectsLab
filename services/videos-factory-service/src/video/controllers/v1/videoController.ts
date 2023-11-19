import { Request, Response } from "express";

import { renderVideo } from "../../services/renderVideo";

const get = async (request: Request, result: Response) => {
    await renderVideo();
    result.status(200).json({ result: "video controller GET" });
};

export default {
    get,
};

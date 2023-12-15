import "dotenv/config";
import "module-alias/register";

import cors from "cors";
import express, { json } from "express";
import ffmpegStatic from "ffmpeg-static";
import { setFfmpegPath } from "fluent-ffmpeg";

import routes from "./routes/_routes";

const app = express();

setFfmpegPath(ffmpegStatic || "");

const port = process.env.PORT || 3002;

app.use(json());

const allowedOrigins = ["http://localhost:3000"]; // Add your allowed origins

const corsOptions: any = {
    origin: function (origin: string, callback: (err: Error | null, options?: any) => void) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

const main = async () => {
    app.use("/", routes());

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

main();

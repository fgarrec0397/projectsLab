import "dotenv/config";

import cors from "cors";
import express, { json } from "express";

import routes from "./routes/_routes";

const app = express();

const port = process.env.PORT || 3001;

app.use(json());

const allowedOrigins = ["https://projects-lab-ouija.vercel.app", "http://localhost:3000"]; // Add your allowed origins

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

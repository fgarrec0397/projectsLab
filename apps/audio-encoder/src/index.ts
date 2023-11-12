import express from "express";
import routes from "./routes/_routes";
import "dotenv/config";
import cors from "cors";

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

const allowedOrigins = ["http://example.com", "http://localhost:3000"]; // Add your allowed origins

// app.use(
//     cors({
//         origin: "http://localhost:3000",
//     })
// );

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

// app.use(cors());

const main = async () => {
    app.use("/", routes());

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

main();

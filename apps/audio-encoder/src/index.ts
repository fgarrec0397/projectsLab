import express from "express";
import routes from "./routes/_routes";
import "dotenv/config";
import cors from "cors";

const app = express();

const port = process.env.SERVER_PORT;

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.use(cors());

const main = async () => {
    app.use("/", routes());

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

main();

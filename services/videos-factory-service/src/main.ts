import { NestFactory } from "@nestjs/core";
import session from "express-session";

import { AppModule } from "./app.module";

const secret = process.env.SECRET || "";
const port = process.env.PORT || "3002";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        session({
            secret,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 86400000 },
        })
    );

    if (process.env.CORS_ORIGIN_ENABLED) {
        app.enableCors({
            origin: process.env.CORS_ORIGIN_ENABLED,
            credentials: true,
        });
    }

    await app.listen(port);

    console.log(`App listening on port: ${port}`);
}

bootstrap();

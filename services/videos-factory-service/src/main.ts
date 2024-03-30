import { NestFactory } from "@nestjs/core";
import session from "express-session";

import { AppModule } from "./app.module";
import { TempFoldersService } from "./common/files-system/services/temp-folders.service";

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
            name: "createify.session",
        })
    );

    if (process.env.STORE_FRONT_URL) {
        app.enableCors({
            origin: "*",
            // origin: process.env.STORE_FRONT_URL,
            // credentials: true,
        });
    }

    const tempFoldersService = app.get(TempFoldersService);
    await tempFoldersService.cleanUpAll();

    await app.listen(port);

    console.log(`App listening on port: ${port}`);
}

bootstrap();

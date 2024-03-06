import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { FirebaseAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "./strategies/firebase.strategy";

@Module({
    controllers: [AuthController],
    imports: [PassportModule.register({ session: true })],
    providers: [
        AuthService,
        FirebaseStrategy,
        {
            provide: APP_GUARD,
            useClass: FirebaseAuthGuard,
        },
    ],
})
export class AuthModule {}

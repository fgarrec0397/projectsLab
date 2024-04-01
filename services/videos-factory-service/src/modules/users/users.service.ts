import { Injectable } from "@nestjs/common";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { User } from "./users.types";

@Injectable()
export class UsersService {
    constructor(@InjectDatabase() private readonly database: DatabaseConfig) {}

    async updateUser(userId: string, user: Partial<User>) {}
}

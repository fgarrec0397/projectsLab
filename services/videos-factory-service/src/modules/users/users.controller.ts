import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { UsersService } from "./users.service";
import { User } from "./users.types";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("/:userId")
    getUserById(@Param("userId") userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Post("create")
    createUser(@Body() user: User) {
        return this.usersService.createUser(user);
    }
}

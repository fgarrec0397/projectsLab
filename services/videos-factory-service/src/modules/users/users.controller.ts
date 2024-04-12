import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("/:userId")
    getUserById(@Param("userId") userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Post("create")
    createUser(@Body("userId") userId: string) {
        return this.usersService.createUser(userId);
    }
}

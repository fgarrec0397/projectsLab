import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";

import { UsersService } from "./users.service";
import { User } from "./users.types";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("/current")
    getCurrentUser(@Req() request: Request) {
        return this.usersService.getUserById(request.userId);
    }

    @Get("/:userId")
    getUserById(@Param("userId") userId: string) {
        return this.usersService.getUserById(userId);
    }

    @Patch("/:userId")
    updateUser(@Param("userId") userId: string, @Body() user: Partial<User>) {
        return this.usersService.updateUser(userId, user);
    }

    @Delete("/:userId")
    deleteUser(@Param("userId") userId: string) {
        return this.usersService.deleteUser(userId);
    }

    @Post("create")
    createUser(@Body() user: User) {
        return this.usersService.createUser(user);
    }
}

import { Body, Controller, Post } from "@nestjs/common";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("create")
    createUser(@Body() userId: string) {
        console.log("create user");

        return this.usersService.createUser(userId);
    }
}

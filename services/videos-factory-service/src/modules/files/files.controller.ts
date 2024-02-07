import { Controller, Get, HttpException, HttpStatus, Query, UseGuards } from "@nestjs/common";

import { FirebaseAuthGuard } from "../session/auth.guard";
import { FilesMapper } from "./files.mapper";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly filesMapper: FilesMapper
    ) {}

    @Get()
    @UseGuards(FirebaseAuthGuard)
    async getFiles(@Query("userId") userId: string) {
        console.log({ userId });

        if (!userId) {
            throw new HttpException("No user id received.", HttpStatus.BAD_REQUEST);
        }

        return this.filesMapper.map(userId, this.filesService.getUserFiles);
    }
}

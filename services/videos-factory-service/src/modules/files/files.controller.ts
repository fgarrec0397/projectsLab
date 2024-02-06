import { Controller, Get, Param, UseGuards } from "@nestjs/common";

import { FirebaseAuthGuard } from "../session/auth.guard";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get()
    @UseGuards(FirebaseAuthGuard)
    async getFiles(@Param("userId") userId: string) {
        return this.filesService.getUserFiles(userId);
    }
}

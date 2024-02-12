import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { UseCache } from "src/common/cache/cache.interceptor";

import { UseAuthGuard } from "../auth/auth.guard";
import { FilesMapper } from "./files.mapper";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly filesMapper: FilesMapper
    ) {}

    @Get()
    @UseCache()
    @UseAuthGuard()
    async getFiles(@Query("userId") userId: string, @Query("path") path: string | undefined) {
        if (!userId) {
            throw new HttpException("No user id received.", HttpStatus.BAD_REQUEST);
        }

        const result = await this.filesMapper.map({ userId, path }, this.filesService.getUserFiles);

        return result;
    }

    @Post()
    @UseAuthGuard()
    @UseInterceptors(AnyFilesInterceptor())
    async uploadMultiple(
        @Query("userId") userId: string,
        @UploadedFiles() files: Array<Express.Multer.File> | Express.Multer.File
    ) {
        await this.filesService.uploadUserFiles(userId, files);

        return { message: `files uploaded successfully!` };
    }

    @Post("createFolder")
    @UseAuthGuard()
    async createFolder(@Query("userId") userId: string, @Query("folderName") folderName: string) {
        console.log(folderName, "folderName in backend");

        await this.filesService.createFolder(userId, folderName);

        return { message: `files uploaded successfully!` };
    }
}

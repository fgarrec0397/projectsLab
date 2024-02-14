import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    ParseBoolPipe,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { UseCache } from "src/common/cache/decorators/use-cache.decorator";
import { UseInvalidateCache } from "src/common/cache/decorators/use-invalidate-cache.decorator";
import { WEEK_IN_SECONDS } from "src/common/constants";

import { FilesMapper } from "./files.mapper";
import { FilesService } from "./files.service";

const filesCacheKey = "files-list";

@Controller("files")
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly filesMapper: FilesMapper
    ) {}

    @Get()
    @UseCache(filesCacheKey, WEEK_IN_SECONDS)
    async getFiles(
        @Query("userId") userId: string,
        @Query("path") path: string | undefined,
        @Query("all", ParseBoolPipe) all: boolean | undefined
    ) {
        if (!userId) {
            throw new HttpException("No user id received.", HttpStatus.BAD_REQUEST);
        }

        const result = await this.filesMapper.map(
            { userId, path, all },
            this.filesService.getUserFiles
        );

        let sanitizedResult = result;

        if (Array.isArray(result)) {
            sanitizedResult = result.filter((x) => x !== null && x !== undefined);
        }

        return sanitizedResult;
    }

    @Post()
    @UseInvalidateCache(filesCacheKey)
    @UseInterceptors(AnyFilesInterceptor())
    async uploadFiles(
        @Query("userId") userId: string,
        @UploadedFiles() files: Array<Express.Multer.File> | Express.Multer.File
    ) {
        await this.filesService.uploadUserFiles(userId, files);

        return { message: `files uploaded successfully!` };
    }

    @Patch()
    @UseInvalidateCache(filesCacheKey)
    async editFile(
        @Body("userId") userId: string,
        @Body("filePath") filePath: string,
        @Body("newFilePath") newFilePath: string
    ) {
        console.log({ filePath, newFilePath });

        // await this.filesService.createFolder(userId, folderName);

        return { message: `files uploaded successfully!` };
    }

    @Post("createFolder")
    @UseInvalidateCache(filesCacheKey)
    async createFolder(@Query("userId") userId: string, @Query("folderName") folderName: string) {
        await this.filesService.createFolder(userId, folderName);

        return { message: `files uploaded successfully!` };
    }
}

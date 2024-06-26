import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    ParseBoolPipe,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { useAuthCacheKey } from "src/common/cache/cache.utils";
import { UseCache } from "src/common/cache/decorators/use-cache.decorator";
import { UseInvalidateCache } from "src/common/cache/decorators/use-invalidate-cache.decorator";
import { MONTH_IN_SECONDS } from "src/common/constants";

import { AfterFilesUploadInterceptor } from "./interceptors/after-files-upload.interceptor";
import { FilesMapper } from "./mappers/files.mapper";
import { FilesValidationPipe } from "./pipes/files-validation.pipe";
import { FilesService } from "./services/files.service";

const filesCacheKey = useAuthCacheKey("files-list");

@Controller("files")
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly filesMapper: FilesMapper
    ) {}

    @Get()
    @UseCache(filesCacheKey, MONTH_IN_SECONDS)
    async getFiles(
        @Req() request: Request,
        @Query("path") path: string | undefined,
        @Query("all", ParseBoolPipe) all: boolean | undefined
    ) {
        const { userId } = request;

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
    @UseInterceptors(AfterFilesUploadInterceptor)
    async uploadFiles(
        @Req() request: Request,
        @UploadedFiles(new FilesValidationPipe())
        files: Array<Express.Multer.File> | Express.Multer.File
    ) {
        if ((Array.isArray(files) && !files.length) || (!Array.isArray(files) && !files)) {
            throw new HttpException("No valid file(s)", HttpStatus.BAD_REQUEST);
        }

        const uploadedFiles = await this.filesService.uploadUserFiles(request.userId, files);

        const uploadedFilesIds = Array.isArray(uploadedFiles)
            ? uploadedFiles.map((x) => x.Key)
            : [uploadedFiles.Key];

        return {
            message: `files uploaded successfully!`,
            uploadedFilesIds,
        };
    }

    @Patch()
    @UseInvalidateCache(filesCacheKey)
    async renameFile(
        @Req() request: Request,
        @Body("filePath") filePath: string,
        @Body("newFileName") newFileName: string
    ) {
        const { userId } = request;

        await this.filesService.renameFile(userId, filePath, newFileName);

        return { message: `files uploaded successfully!` };
    }

    @Post("createFolder")
    @UseInvalidateCache(filesCacheKey)
    async createFolder(@Req() request: Request, @Query("folderName") folderName: string) {
        const { userId } = request;

        await this.filesService.createFolder(userId, folderName);

        return { message: `files uploaded successfully!` };
    }

    @Delete()
    @UseInvalidateCache(filesCacheKey)
    async delete(@Req() request: Request, @Query("fileIds") fileIds: string | undefined) {
        console.log(fileIds, "fileIds");

        if (!fileIds) {
            throw new HttpException("fileIds parameter missing", HttpStatus.BAD_REQUEST);
        }

        const idsArray = fileIds.split(",");
        await this.filesService.delete(request.userId, idsArray);

        return { message: `files uploaded successfully!` };
    }
}

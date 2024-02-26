import { Module, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import S3StorageManager from "src/common/storage/strategies/s3-storage-manager";

import {
    TEMPLATE_GENERATOR_SERVICE_TOKEN,
    TemplateGeneratorService,
} from "./template-generator.service";

const templateGeneratorService = {
    provide: TEMPLATE_GENERATOR_SERVICE_TOKEN,
    useFactory: async (request: Request) => {
        console.log(request.videoData, "request.videoData in useFactory");
        const s3Storage = new S3StorageManager(new ConfigService());

        s3Storage.init();

        return new TemplateGeneratorService(s3Storage, request.videoData);
    },
    inject: [REQUEST],
    scope: Scope.REQUEST,
};

@Module({
    providers: [templateGeneratorService],
    exports: [templateGeneratorService],
})
export class TemplateGeneratorModule {}

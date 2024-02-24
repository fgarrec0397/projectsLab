import { Module } from "@nestjs/common";

import { TemplateGeneratorService } from "./template-generator.service";

@Module({
    providers: [TemplateGeneratorService],
    exports: [TemplateGeneratorService],
})
export class TemplateGeneratorModule {}

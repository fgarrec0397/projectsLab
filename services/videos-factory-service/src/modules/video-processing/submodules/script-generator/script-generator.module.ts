import { Module } from "@nestjs/common";

import { ScriptGeneratorService } from "./script-generator.service";

@Module({
    providers: [ScriptGeneratorService],
    exports: [ScriptGeneratorService],
})
export class ScriptGeneratorModule {}

import { Module, Scope } from "@nestjs/common";
import { ContextIdFactory, REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
    TEXT_GENERATOR_STRATEGY_TOKEN,
    TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
    VOICE_GENERATOR_STRATEGY_TOKEN,
} from "src/common/dependencies_tokens";

import { ScriptGeneratorService } from "./script-generator.service";
import { OpenAITextGeneratorStrategy } from "./strategies/TextGeneratorStrategy/OpenAITextGeneratorStrategy";
import { DeepgramTimestampsGeneratorStrategy } from "./strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "./strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";

@Module({
    providers: [
        ScriptGeneratorService,
        {
            provide: TEXT_GENERATOR_STRATEGY_TOKEN,
            useClass: OpenAITextGeneratorStrategy,
            useFactory: async (request: Request) => {
                return new OpenAITextGeneratorStrategy(request.videoData);
            },
            inject: [REQUEST],
            scope: Scope.REQUEST,
        },
        {
            provide: VOICE_GENERATOR_STRATEGY_TOKEN,
            useClass: OpenAIVoiceGeneratorStrategy,
            // useFactory: async (request: Request) => {
            //     return new OpenAIVoiceGeneratorStrategy(request.videoData);
            // },
            // inject: [REQUEST],
            // scope: Scope.REQUEST,
        },
        {
            provide: TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
            useClass: DeepgramTimestampsGeneratorStrategy,
            // useFactory: async (request: Request) => {
            //     return new DeepgramTimestampsGeneratorStrategy(request.videoData);
            // },
            // inject: [REQUEST],
            // scope: Scope.REQUEST,
        },
    ],
    exports: [ScriptGeneratorService],
})
export class ScriptGeneratorModule {}

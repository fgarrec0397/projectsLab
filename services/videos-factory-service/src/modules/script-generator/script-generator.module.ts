import { Module } from "@nestjs/common";
import {
    TEXT_GENERATOR_STRATEGY_TOKEN,
    TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
    VOICE_GENERATOR_STRATEGY_TOKEN,
} from "src/common/dependencies_tokens";

import { ScriptGeneratorService } from "./script-generator.service";
import { OpenAITextGeneratorStrategy } from "./strategies/TextGeneratorStrategy/OpenAITextGeneratorStrategy";
import { DeepgramTimestampsGeneratorStrategy } from "./strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "./strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";

const customProviders = [
    {
        provide: TEXT_GENERATOR_STRATEGY_TOKEN,
        useClass: OpenAITextGeneratorStrategy,
    },
    {
        provide: VOICE_GENERATOR_STRATEGY_TOKEN,
        useClass: OpenAIVoiceGeneratorStrategy,
    },
    {
        provide: TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
        useClass: DeepgramTimestampsGeneratorStrategy,
    },
];

@Module({
    providers: [ScriptGeneratorService, ...customProviders],
    exports: [ScriptGeneratorService],
})
export class ScriptGeneratorModule {}

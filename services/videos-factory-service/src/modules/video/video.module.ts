import { Module } from "@nestjs/common";
import S3StorageManager from "src/common/services/s3-storage-manager.service";

import {
    TEXT_GENERATOR_STRATEGY_TOKEN,
    TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
    VOICE_GENERATOR_STRATEGY_TOKEN,
} from "../../common/dependencies_tokens";
import { OpenAITextGeneratorStrategy } from "./components/ScriptManager/Strategies/TextGeneratorStrategy/OpenAITextGeneratorStrategy";
import { DeepgramTimestampsGeneratorStrategy } from "./components/ScriptManager/Strategies/TimestampsGeneratorStrategy/DeepgramTimestampsGeneratorStrategy";
import { OpenAIVoiceGeneratorStrategy } from "./components/ScriptManager/Strategies/VoiceGeneratorStrategy/OpenAIVoiceGeneratorStrategy";
import { TemplateGenerator } from "./components/TemplateGenerator/TemplateGenerator";
import { VideoRenderer } from "./components/VideoRenderer/VideoRenderer";
import { ScriptService } from "./services/script.service";
import { TemplateService } from "./services/template.service";
import { VideoService } from "./services/video.service";
import { VideoController } from "./video.controller";

const servicesProviders = [VideoService, ScriptService, TemplateService];

const customProviders = [
    S3StorageManager,
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
    VideoRenderer,
    TemplateGenerator,
];

@Module({
    controllers: [VideoController],
    providers: [...customProviders, ...servicesProviders],
})
export class VideoModule {}

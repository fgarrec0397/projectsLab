import { Module } from "@nestjs/common";

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
import { VideoGeneratorService } from "./services/generateVideo.service";
import { ScriptService } from "./services/videoGenerator/script.service";
import { TemplateService } from "./services/videoGenerator/template.service";
import { VideoRendererService } from "./services/videoGenerator/videoRenderer.service";
import { VideosService } from "./services/videos.service";
import { VideoController } from "./videos.controller";

const servicesProviders = [
    VideosService,
    VideoRendererService,
    ScriptService,
    TemplateService,
    VideoGeneratorService,
];

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
    VideoRenderer,
    TemplateGenerator,
];

@Module({
    controllers: [VideoController],
    providers: [...customProviders, ...servicesProviders],
})
export class VideosModule {}

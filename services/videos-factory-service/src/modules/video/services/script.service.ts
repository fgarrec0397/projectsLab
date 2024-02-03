import { Inject, Injectable } from "@nestjs/common";

import {
    TEXT_GENERATOR_STRATEGY_TOKEN,
    TIMESTAMPS_GENERATOR_STRATEGY_TOKEN,
    VOICE_GENERATOR_STRATEGY_TOKEN,
} from "../../../common/dependencies_tokens";
import { Script, ScriptManager } from "../components/ScriptManager/ScriptManager";
import { TextGeneratorStrategy } from "../components/ScriptManager/Strategies/TextGeneratorStrategy/TextGeneratorStrategy";
import { TimestampsGeneratorStrategy } from "../components/ScriptManager/Strategies/TimestampsGeneratorStrategy/TimestampsGeneratorStrategy";
import { VoiceGeneratorStrategy } from "../components/ScriptManager/Strategies/VoiceGeneratorStrategy/VoiceGeneratorStrategy";

@Injectable()
export class ScriptService {
    constructor(
        @Inject(TEXT_GENERATOR_STRATEGY_TOKEN)
        private textGeneratorStrategy: TextGeneratorStrategy,
        @Inject(VOICE_GENERATOR_STRATEGY_TOKEN)
        private voiceGeneratorStrategy: VoiceGeneratorStrategy,
        @Inject(TIMESTAMPS_GENERATOR_STRATEGY_TOKEN)
        private timestampsGeneratorStrategy: TimestampsGeneratorStrategy
    ) {}

    async generateScript(): Promise<Script> {
        const scriptManager = new ScriptManager({
            textGeneratorStrategy: this.textGeneratorStrategy,
            voiceGeneratorStrategy: this.voiceGeneratorStrategy,
            timestampsGeneratorStrategy: this.timestampsGeneratorStrategy,
        });

        return scriptManager.generateScript();
    }
}

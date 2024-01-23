import { Script, ScriptManager } from "../modules/ScriptManager/ScriptManager";
import { TextGeneratorStrategy } from "../modules/ScriptManager/Strategies/TextGeneratorStrategy/TextGeneratorStrategy";
import { TimestampsGeneratorStrategy } from "../modules/ScriptManager/Strategies/TimestampsGeneratorStrategy/TimestampsGeneratorStrategy";
import { VoiceGeneratorStrategy } from "../modules/ScriptManager/Strategies/VoiceGeneratorStrategy/VoiceGeneratorStrategy";

export class ScriptService {
    private textGeneratorStrategy: TextGeneratorStrategy;

    private voiceGeneratorStrategy: VoiceGeneratorStrategy;

    private timestampsGeneratorStrategy: TimestampsGeneratorStrategy;

    constructor(
        textGeneratorStrategy: TextGeneratorStrategy,
        voiceGeneratorStrategy: VoiceGeneratorStrategy,
        timestampsGeneratorStrategy: TimestampsGeneratorStrategy
    ) {
        this.textGeneratorStrategy = textGeneratorStrategy;
        this.voiceGeneratorStrategy = voiceGeneratorStrategy;
        this.timestampsGeneratorStrategy = timestampsGeneratorStrategy;
    }

    async generateScript(): Promise<Script> {
        const scriptManager = new ScriptManager({
            textGeneratorStrategy: this.textGeneratorStrategy,
            voiceGeneratorStrategy: this.voiceGeneratorStrategy,
            timestampsGeneratorStrategy: this.timestampsGeneratorStrategy,
        });

        return scriptManager.generateScript();
    }
}

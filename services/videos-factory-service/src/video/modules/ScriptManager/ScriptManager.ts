import fs from "fs";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { TimedText } from "../../videoTypes";
import { TimestampsGeneratorStrategy } from "./Strategies/TimestampsGeneratorStrategy/TimestampsGeneratorStrategy";
import { VoiceGeneratorStrategy } from "./Strategies/VoiceGeneratorStrategy/VoiceGeneratorStrategy";

export class ScriptManager {
    subtitles: TimedText[] = [];

    private voiceBuffer: Buffer | undefined;

    private voiceFilePath: string = getAssetsPath("speech.flac");

    private text: string | undefined;

    private voiceGeneratorStrategy: VoiceGeneratorStrategy;

    private timestampsGeneratorStrategy: TimestampsGeneratorStrategy;

    constructor(
        voiceGeneratorStrategy: VoiceGeneratorStrategy,
        timestampsGeneratorStrategy: TimestampsGeneratorStrategy
    ) {
        this.voiceGeneratorStrategy = voiceGeneratorStrategy;
        this.timestampsGeneratorStrategy = timestampsGeneratorStrategy;
    }

    async generateScript() {
        await this.generateText();
        await this.generateVoice();
        await this.generateTimestampsBasedOnAudio();
    }

    private async generateText() {
        // TODO - Generate the text via openAI, this temporary mocked data
        this.text = `Did you know that honey can last for thousands of years? Archaeologists found honey in Egyptian tombs over 3,000 years old, and it's still good to eat! Did you know octopuses have three hearts? Two pump blood to their gills and one to the rest of the body. Ever heard of a "flamboyance"? That's what you call a group of flamingos. And get this, the shortest war ever was between Britain and Zanzibar in 1896, lasting only 38 minutes! Here's a tricky one: did you know bananas are actually berries, but strawberries aren't? In the botanical world, a berry comes from a single flower's ovary and has seeds in its flesh. Did you know the Eiffel Tower grows in summer? It can get 15 cm taller because of the heat expanding the iron. Think there are more stars in the Milky Way or trees on Earth? Earth wins with over 3 trillion trees! Cows have best friends too, and they get stressed if separated. Here's a wild one: the guy who invented the Frisbee turned into one after he died – his ashes were made into a Frisbee in 2010. Lastly, a jiffy isn't just quick, it's a real time unit, exactly 1/100th of a second. Bet you didn't know all of these!`;
    }

    private async generateVoice() {
        if (!this.text) {
            return;
        }

        this.voiceBuffer = await this.voiceGeneratorStrategy.generateVoice(
            this.text,
            this.voiceFilePath
        );
        await fs.promises.writeFile(this.voiceFilePath, this.voiceBuffer);
    }

    private async generateTimestampsBasedOnAudio() {
        if (!this.voiceBuffer) {
            return;
        }
        this.subtitles = await this.timestampsGeneratorStrategy.generateTimestampsBasedOnAudio(
            this.voiceBuffer
        );
    }
}

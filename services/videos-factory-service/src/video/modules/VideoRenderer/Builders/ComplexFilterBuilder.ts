export class ComplexFilterBuilder {
    private audioCount: number = 0;

    private videoCount: number = 0;

    private videoWithAudioCount: number = 0;

    private audioOutputName = "a_out";

    private videoOutputName = "v";

    private audioComplexFilter: string[] = [];

    private videoComplexFilter: string[] = [];

    private videoWithAudioComplexFilter: string[] = [];

    private finalComplexFilter: string[] = [];

    addVideoWithAudio() {
        this.videoWithAudioComplexFilter.push(
            `[${this.videoWithAudioCount}:v] [${this.videoWithAudioCount}:a]`
        );
        this.incrementVideoWithAudioCount();

        return this;
    }

    // TODO - need to also handle only video in the future
    addVideo() {
        this.videoComplexFilter.push(`[${this.videoCount}:v:0]`);

        return this;
    }

    addAudio() {
        this.audioComplexFilter.push(`[${this.audioCount}:a:0]`);
        this.incrementAudioCount();

        return this;
    }

    getMapping() {
        return [this.videoOutputName, this.audioOutputName];
    }

    build() {
        this.concatVideoWithAudioComplexFilter();
        this.concatAudioComplexFilter();

        if (!this.finalComplexFilter.length) {
            return "";
        }

        return this.finalComplexFilter;
    }

    private concatVideoWithAudioComplexFilter() {
        if (this.videoWithAudioCount === 0) {
            return;
        }

        const videoWithAudioConcatFilter =
            this.videoWithAudioComplexFilter.join(" ") +
            `concat=n=${this.videoWithAudioCount}:${this.videoOutputName}=1:a=1 [${this.videoOutputName}] [a]`;

        this.finalComplexFilter.push(videoWithAudioConcatFilter);
    }

    private concatAudioComplexFilter() {
        if (this.audioCount === 0) {
            return;
        }

        const adjustedAudioComplexFilter = this.audioComplexFilter.map(
            (_, index) => `[${index + this.videoWithAudioCount}:a]`
        );

        const audioConcatFilter = `[a]${adjustedAudioComplexFilter.join("")}amix=inputs=${
            adjustedAudioComplexFilter.length + 1
        }[${this.audioOutputName}]`;

        this.finalComplexFilter.push(audioConcatFilter);
    }

    private incrementVideoWithAudioCount() {
        this.videoWithAudioCount++;
    }

    private incrementAudioCount() {
        this.audioCount++;
    }
}

export class ComplexFilterBuilder {
    private audioCount: number = 0;

    private videoCount: number = 0;

    private overlayCount: number = 0;

    private videoWithAudioCount: number = 0;

    private audioOutputName = "a_out";

    private videoOutputName = "v";

    private audioComplexFilter: string[] = [];

    private videoComplexFilter: string[] = [];

    private overlayComplexFilter: string = "";

    private videoWithAudioComplexFilter: string[] = [];

    private finalComplexFilter: string[] = [];

    addVideoWithAudio() {
        this.videoWithAudioComplexFilter.push(
            `[${this.videoWithAudioCount}:v][${this.videoWithAudioCount}:a]`
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

    addOverlay(start?: number, end?: number) {
        let overlayFilter = `[${this.videoOutputName}]`;

        overlayFilter += `[${
            this.videoWithAudioCount + this.audioCount + this.overlayCount
        }:v]overlay`;

        // Set the time when it is enabled
        if (start !== undefined && end !== undefined) {
            overlayFilter += `=enable='between(t,${start},${end})'`;
        }

        // Set the position
        overlayFilter += `=x=0:y=0`;

        this.videoOutputName = "v_out";

        overlayFilter += `[${this.videoOutputName}]`;

        this.overlayComplexFilter = overlayFilter;
    }

    getMapping() {
        return [this.videoOutputName, this.audioOutputName];
    }

    build() {
        this.concatVideoWithAudioComplexFilter();
        this.concatAudioComplexFilter();
        this.concatOverlayComplexFilter();

        if (!this.finalComplexFilter.length) {
            return "";
        }

        console.log(this.finalComplexFilter, "this.finalComplexFilter");
        console.log(this.finalComplexFilter.join(";"), "this.finalComplexFilter.join(';')");

        return `"${this.finalComplexFilter.join(";")}"`;
    }

    private concatVideoWithAudioComplexFilter() {
        if (this.videoWithAudioCount === 0) {
            return;
        }

        const videoWithAudioConcatFilter =
            this.videoWithAudioComplexFilter.join("") +
            `concat=n=${this.videoWithAudioCount}:v=1:a=1[v][a]`;

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

    private concatOverlayComplexFilter() {
        this.finalComplexFilter.push(this.overlayComplexFilter);
    }

    private incrementVideoWithAudioCount() {
        this.videoWithAudioCount++;
    }

    private incrementAudioCount() {
        this.audioCount++;
    }
}

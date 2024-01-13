type SizeParam = {
    width: number;
    height: number;
};

// TODO - Check to implement a decorator that would manage the chaning of output name on each function that needs it
export class ComplexFilterBuilder {
    private audioCount: number = 0;

    private videoCount: number = 0;

    private overlayCount: number = 0;

    private videoWithAudioCount: number = 0;

    private audioOutputName = "a_out";

    private videoOutputName = "";

    private audioComplexFilter: string[] = [];

    private videoComplexFilter: string[] = [];

    private overlayComplexFilter: string[] = [];

    private videoWithAudioComplexFilter: string[] = [];

    private cropComplexFilter: string = "";

    private finalComplexFilter: string[] = [];

    addVideoWithAudio() {
        if (this.videoOutputName === "") {
            this.videoOutputName = "v";
        }

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

    addOverlayOnVideo(options?: { start?: number; end?: number }) {
        const currentOverlayIndex =
            this.audioCount > 0 && this.videoWithAudioCount > 0
                ? this.audioCount + this.videoWithAudioCount + this.overlayCount
                : this.overlayCount + 1;

        let fromStream = this.videoOutputName === "" ? `[0:v]` : `[${this.videoOutputName}]`;
        let currentStream = `[${currentOverlayIndex}:v]`;

        if (this.overlayCount > 1) {
            fromStream = `[${this.videoOutputName}]`;
            currentStream = `[${currentOverlayIndex}:v]`;
        }

        let overlayFilter = fromStream + currentStream;
        let enableArg: string | undefined;

        overlayFilter += `overlay`;

        if (options?.start !== undefined && options?.end !== undefined) {
            enableArg = `=enable='between(t,${options.start},${options.end})'`;
        }

        if (enableArg !== undefined) {
            overlayFilter += enableArg;
            overlayFilter += `:x=0:y=0`;
        } else {
            overlayFilter += `=x=0:y=0`;
        }

        const overlayOutputName = `ovl${this.overlayCount}`;

        this.videoOutputName = overlayOutputName;

        overlayFilter += `[${overlayOutputName}]`;

        this.overlayComplexFilter.push(overlayFilter);

        this.overlayCount++;
    }

    setCrop(size: SizeParam) {
        const videoInputName = this.videoOutputName !== "" ? this.videoOutputName : "0:v";
        const newVideoOutputName = "vCropped";
        this.cropComplexFilter = `[${videoInputName}]crop=out_w=in_h*(${size.width}/${size.height}):out_h=in_h[${newVideoOutputName}]`;
        this.videoOutputName = newVideoOutputName;
    }

    getMapping() {
        const mapping: string[] = [];

        if (this.videoOutputName !== "") {
            mapping.push(this.videoOutputName);
        }

        if (this.audioCount > 0) {
            mapping.push(this.audioOutputName);
        } else {
            mapping.push("0:a");
        }

        return mapping;
    }

    build() {
        this.mergeVideoWithAudioComplexFilter();
        this.mergeCropComplexFilter();
        this.mergeAudioComplexFilter();
        this.mergeOverlayComplexFilter();

        if (!this.finalComplexFilter.length) {
            return "";
        }

        return this.finalComplexFilter.join(";");
    }

    reset() {
        this.audioCount = 0;
        this.videoCount = 0;
        this.overlayCount = 0;
        this.videoWithAudioCount = 0;
        this.audioOutputName = "a_out";
        this.videoOutputName = "";
        this.audioComplexFilter = [];
        this.videoComplexFilter = [];
        this.overlayComplexFilter = [];
        this.videoWithAudioComplexFilter = [];
        this.cropComplexFilter = "";
        this.finalComplexFilter = [];
    }

    private mergeVideoWithAudioComplexFilter() {
        if (this.videoWithAudioCount === 0) {
            return;
        }

        const videoWithAudioConcatFilter =
            this.videoWithAudioComplexFilter.join("") +
            `concat=n=${this.videoWithAudioCount}:v=1:a=1[v][a]`;

        this.finalComplexFilter.push(videoWithAudioConcatFilter);
    }

    private mergeCropComplexFilter() {
        if (this.cropComplexFilter === "") {
            return;
        }

        this.finalComplexFilter.push(this.cropComplexFilter);
    }

    private mergeAudioComplexFilter() {
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

    private mergeOverlayComplexFilter() {
        const overlayConcatFilter = this.overlayComplexFilter.join(";");

        this.finalComplexFilter.push(overlayConcatFilter);
    }

    private incrementVideoWithAudioCount() {
        this.videoWithAudioCount++;
    }

    private incrementAudioCount() {
        this.audioCount++;
    }
}

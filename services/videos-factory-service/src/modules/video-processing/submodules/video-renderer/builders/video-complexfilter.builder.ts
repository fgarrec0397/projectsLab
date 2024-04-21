type SizeParam = {
    width: number;
    height: number;
};

type VideoWithAudioStream = {
    video: VideoStream;
    audio: AudioStream;
};

type VideoStream = {
    inputName: string;
    outputName: string;
    options?: string[];
};

type AudioStream = {
    inputName: string;
    outputName: string;
    options?: string[];
};

type Overlay = { index: number; start?: number; end?: number };

type OverlayParam = Omit<Overlay, "index">;

export class ComplexFilterBuilder {
    private audioCount: number = 0;

    private overlayCount: number = 0;

    private videoWithAudioCount: number = 0;

    private audioOutputName = "a_out";

    private videoOutputName = "";

    private videoWithAudioStreams: VideoWithAudioStream[] = [];

    private audioStreams: AudioStream[] = [];

    private cropComplexFilter: string = "";

    private size: SizeParam | undefined;

    private overlays: Overlay[] | undefined;

    private finalComplexFilter: string[] = [];

    addVideoWithAudio(videoOptions?: { volume?: number }, audioOptions?: { volume?: number }) {
        if (this.videoOutputName === "") {
            this.videoOutputName = "v";
        }

        this.videoWithAudioStreams.push({
            video: {
                inputName: `[${this.videoWithAudioCount}:v]`,
                outputName: `[v${this.videoWithAudioCount}]`,
                options:
                    videoOptions?.volume !== undefined
                        ? [`volume=${videoOptions?.volume}`]
                        : undefined, // should be an array of something like that [0:a]volume=0.8[a0];
            },
            audio: {
                inputName: `[${this.videoWithAudioCount}:a]`,
                outputName: `[a${this.videoWithAudioCount}]`,
                options:
                    audioOptions?.volume !== undefined
                        ? [`volume=${audioOptions?.volume}`]
                        : undefined, // should be an array of something like that [0:a]volume=0.8[a0];
            },
        });

        this.incrementVideoWithAudioCount();

        return this;
    }

    addAudio(audioOptions?: { volume?: number }) {
        // this.audioComplexFilter.push({
        //     adjustedName: volume ? `aAdjustedVolume${this.audioCount}` : undefined,
        //     volume,
        // });

        this.audioStreams.push({
            inputName: `[${this.videoWithAudioCount}:a]`,
            outputName: `[a${this.videoWithAudioCount}]`,
            options: audioOptions ? [`volume=${audioOptions.volume}`] : undefined,
        });

        this.incrementAudioCount();

        return this;
    }

    addOverlayOnVideo(options?: OverlayParam) {
        if (!this.overlays) {
            this.overlays = [];
        }

        this.overlays.push({ index: this.overlayCount, ...options });

        this.overlayCount++;

        return this;
    }

    setCrop(size: SizeParam) {
        this.size = size;

        return this;
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
        this.buildStreamsOptions();
        this.concatVideoWithAudioComplexFilter();
        // this.buildVideoWithAudioComplexFilter();
        this.buildCropComplexFilter();
        this.mixAudioStreams();
        this.buildOverlayComplexFilter();

        if (!this.finalComplexFilter.length) {
            return "";
        }

        return this.finalComplexFilter.join(";");
    }

    reset() {
        this.audioCount = 0;
        this.overlayCount = 0;
        this.videoWithAudioCount = 0;
        this.audioOutputName = "a_out";
        this.videoOutputName = "";
        this.cropComplexFilter = "";
        this.size = undefined;
        this.overlays = [];
        this.finalComplexFilter = [];
    }

    private buildStreamsOptions() {
        const videoOptions = this.videoWithAudioStreams
            .map((x) => {
                return [
                    `${x.video.inputName}${x.video.options ? x.video.options.join(",") : "null"}${
                        x.video.outputName
                    }`,
                    `${x.audio.inputName}${x.audio.options ? x.audio.options.join(",") : "anull"}${
                        x.audio.outputName
                    }`,
                ].join(";");
            })
            .join(";");

        const audioOptions = this.audioStreams
            .map((x) => `${x.inputName}${x.options.join(",")}${x.outputName}`)
            .join(";");

        this.finalComplexFilter.push(videoOptions, audioOptions);
    }

    private concatVideoWithAudioComplexFilter() {
        if (this.videoWithAudioCount === 0) {
            return;
        }

        const videoWithAudioConcatFilter =
            this.videoWithAudioStreams
                .map((x) => `${x.video.outputName}${x.audio.outputName}`)
                .join("") + `concat=n=${this.videoWithAudioStreams.length}:v=1:a=1[v][a]`;

        this.finalComplexFilter.push(videoWithAudioConcatFilter);
    }

    private buildCropComplexFilter() {
        if (!this.size) {
            return;
        }

        const videoInputName =
            this.videoWithAudioCount > 0
                ? "v"
                : this.videoOutputName !== ""
                  ? this.videoOutputName
                  : "0:v";
        const newVideoOutputName = "vCropped";

        this.cropComplexFilter = `[${videoInputName}]crop=out_w=in_h*(${this.size.width}/${this.size.height}):out_h=in_h[${newVideoOutputName}]`;
        this.videoOutputName = newVideoOutputName;

        this.finalComplexFilter.push(this.cropComplexFilter);
    }

    private mixAudioStreams() {
        if (this.audioCount === 0) {
            return;
        }

        const audioOutputs = this.audioStreams.map((x) => `${x.outputName}`).join("");

        const audioConcatFilter = `[a]${audioOutputs}amix=inputs=${this.audioStreams.length + 1}[${
            this.audioOutputName
        }]`;

        this.finalComplexFilter.push(audioConcatFilter);
    }

    // TODO - make sure this works when will need it
    private buildOverlayComplexFilter() {
        const overlayComplexFilter: string[] = [];

        this.overlays?.forEach((overlay, index) => {
            const currentOverlayIndex =
                this.audioCount > 0 && this.videoWithAudioCount > 0
                    ? this.audioCount + this.videoWithAudioCount + index
                    : index + 1;

            let fromStream = this.videoOutputName === "" ? `[0:v]` : `[${this.videoOutputName}]`;
            let currentStream = `[${currentOverlayIndex}:v]`;

            if (this.overlayCount > 1) {
                fromStream = `[${this.videoOutputName}]`;
                currentStream = `[${currentOverlayIndex}:v]`;
            }

            let overlayFilter = fromStream + currentStream;
            let enableArg: string | undefined;

            overlayFilter += `overlay`;

            if (overlay?.start !== undefined && overlay?.end !== undefined) {
                enableArg = `=enable='between(t,${overlay.start},${overlay.end})'`;
            }

            if (enableArg !== undefined) {
                overlayFilter += enableArg;
                overlayFilter += `:x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2`;
            } else {
                overlayFilter += `=(main_w-overlay_w)/2:(main_h-overlay_h)/2`;
            }

            const overlayOutputName = `ovl${index}`;

            this.videoOutputName = overlayOutputName;

            overlayFilter += `[${overlayOutputName}]`;

            overlayComplexFilter.push(overlayFilter);
        });

        const overlayConcatFilter = overlayComplexFilter.join(";");

        this.finalComplexFilter.push(overlayConcatFilter);
    }

    private incrementVideoWithAudioCount() {
        this.videoWithAudioCount++;
    }

    private incrementAudioCount() {
        this.audioCount++;
    }
}

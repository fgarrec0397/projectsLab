type SizeParam = {
    width: number;
    height: number;
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

type AudioOption = {
    adjustedName?: string;
    volume?: number;
};

type Overlay = { index: number; start?: number; end?: number };

type OverlayParam = Omit<Overlay, "index">;

export class ComplexFilterBuilder {
    private audioCount: number = 0;

    private videoCount: number = 0;

    private overlayCount: number = 0;

    private videoWithAudioCount: number = 0;

    private audioOutputName = "a_out";

    private videoOutputName = "";

    private videoStreams: VideoStream[] = [];

    private audioStreams: AudioStream[] = [];

    private audioComplexFilter: AudioOption[] = [];

    private videoComplexFilter: string[] = [];

    private overlayComplexFilter: string[] = [];

    private videoWithAudioComplexFilter: string[] = [];

    private cropComplexFilter: string = "";

    private size: SizeParam | undefined;

    private overlays: Overlay[] | undefined;

    private finalComplexFilter: string[] = [];

    // Current Complex filter
    // [0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a][4:v][4:a][5:v][5:a][6:v][6:a]concat=n=7:v=1:a=1[v][a];
    // [v]crop=out_w=in_h*(1080/1920):out_h=in_h[vCropped];
    // [7:a]volume=1.2[aAdjustedVolume0];
    // [a][aAdjustedVolume0]amix=inputs=2[a_out];
    //  -map [vCropped] -map [a_out]

    // Should have
    // [0:a]volume=0.8[a0];
    // [0:v]null[v0];
    // [1:a]anull[a1];
    // [1:v]null[v1];
    // [2:a]null[a2];
    // [v0][a0][v1][a1]concat=n=3:v=1:a=1[v][a];

    addVideoWithAudio(videoOptions?: { volume?: number }, audioOptions?: { volume?: number }) {
        if (this.videoOutputName === "") {
            this.videoOutputName = "v";
        }

        this.videoStreams.push({
            inputName: `[${this.videoWithAudioCount}:v]`,
            outputName: `[v${this.videoWithAudioCount}]`,
            options: videoOptions, // should be an array of something like that [0:a]volume=0.8[a0];
        });

        this.audioStreams.push({
            inputName: `[${this.videoWithAudioCount}:a]`,
            outputName: `[a${this.videoWithAudioCount}]`,
            options: audioOptions, // should be an array of something like that [0:a]volume=0.8[a0];
        });

        // this.videoWithAudioComplexFilter.push(
        //     `[${this.videoWithAudioCount}:v][${this.videoWithAudioCount}:a]`
        // );

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
            options: audioOptions,
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
        this.buildVideoWithAudioComplexFilter();
        this.buildCropComplexFilter();
        this.buildAudioComplexFilter();
        this.buildOverlayComplexFilter();

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
        this.size = undefined;
        this.overlays = [];
        this.finalComplexFilter = [];
    }

    private buildStreamsOptions() {
        /**
         * Should build this part 0:a]volume=0.8[a0]; \
            [1:a]volume=1.0[a1]; \
            [2:a]volume=0.9[a2]; \
            [3:a]volume=1.2[a3]; \
            [4:a]volume=1.0[a4]; \
            [5:a]volume=1.1[a5]; \
         */
        const videoOptions = this.videoStreams.map((x) => `${x.inputName}${x.options}`);
    }

    private buildVideoWithAudioComplexFilter() {
        if (this.videoWithAudioCount === 0) {
            return;
        }

        const videoWithAudioConcatFilter =
            this.videoWithAudioComplexFilter.join("") +
            `concat=n=${this.videoWithAudioCount}:v=1:a=1[v][a]`;

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

    private buildAudioComplexFilter() {
        if (this.audioCount === 0) {
            return;
        }

        const adjustedAudioComplexFilter = this.audioComplexFilter.map((audio, index) =>
            audio.adjustedName
                ? `[${audio.adjustedName}]`
                : `[${index + this.videoWithAudioCount}:a]`
        );

        let volumeModifiers = this.audioComplexFilter
            ? this.audioComplexFilter
                  .map((audio, index) =>
                      audio.adjustedName
                          ? `[${index + this.videoWithAudioCount}:a]volume=${audio.volume}[${
                                audio.adjustedName
                            }]`
                          : undefined
                  )
                  .filter((x) => x !== undefined)
                  .join(";")
            : "";

        if (volumeModifiers !== "") {
            volumeModifiers += ";";
        }

        const audioConcatFilter = `${volumeModifiers}[a]${adjustedAudioComplexFilter.join(
            ""
        )}amix=inputs=${adjustedAudioComplexFilter.length + 1}[${this.audioOutputName}]`;

        this.finalComplexFilter.push(audioConcatFilter);
    }

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

type SizeParam = {
    width: number;
    height: number;
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

    private audioComplexFilter: AudioOption[] = [];

    private videoComplexFilter: string[] = [];

    private overlayComplexFilter: string[] = [];

    private videoWithAudioComplexFilter: string[] = [];

    private cropComplexFilter: string = "";

    private size: SizeParam | undefined;

    private overlays: Overlay[] | undefined;

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

    addAudio(volume?: number) {
        this.audioComplexFilter.push({
            adjustedName: volume ? `aAdjustedVolume${this.audioCount}` : undefined,
            volume,
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

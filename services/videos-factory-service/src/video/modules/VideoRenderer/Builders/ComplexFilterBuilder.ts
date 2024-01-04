export class ComplexFilterBuilder {
    private audioCount: number = 0;

    private videoCount: number = 0;

    private overlayCount: number = 0;

    private videoWithAudioCount: number = 0;

    private audioOutputName = "a_out";

    // private videoOutputName = "v";
    private videoOutputName = "";

    private audioComplexFilter: string[] = [];

    private videoComplexFilter: string[] = [];

    private overlayComplexFilter: string = "";

    private videoWithAudioComplexFilter: string[] = [];

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

    // TODO - check to refactor the logic of overlays into an array that we join by ";"
    addOverlay(start?: number, end?: number) {
        // this command is working
        // ffmpeg -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\tmp\videos\refactor-video.mp4 -i C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\tmp\output\text-115ee0d9-12b4-4243-bdc6-fdf8ae317a9d.png -y
        // -filter_complex "[0:v][1:v] overlay=x=0:y=0" -vcodec libx264 -r 60 -pix_fmt yuv420p C:\Users\fgarr\Documents\lab\projectsLab\services\videos-factory-service\assets\poc\out\refactor-video.mp4

        console.log("addOverlay called");

        this.overlayCount++;

        let overlayFilter =
            this.videoOutputName === ""
                ? `[${this.overlayCount - 1}:v]`
                : `[${this.videoOutputName}]`; // this should be undefined by default
        let enableArg: string | undefined;

        overlayFilter += `[${
            this.videoWithAudioCount + this.audioCount + this.overlayCount
        }:v]overlay`;

        // Set the time when it is enabled
        if (start !== undefined && end !== undefined) {
            enableArg = `=enable='between(t,${start},${end})'`;
        }

        // Set the position

        if (enableArg !== undefined) {
            overlayFilter += enableArg;
            overlayFilter += `:x=0:y=0`;
        } else {
            overlayFilter += `=x=0:y=0`;
        }

        if (this.videoWithAudioCount > 1) {
            const overlayOutputName = `ovl${this.overlayCount}`;

            this.videoOutputName = overlayOutputName;

            overlayFilter += `[${overlayOutputName}];`;
        } else {
            overlayFilter += ";";
        }

        this.overlayComplexFilter += overlayFilter;
    }

    getMapping() {
        const mapping: string[] = [];

        if (this.videoOutputName !== "") {
            mapping.push(this.videoOutputName);
        }

        if (this.audioCount > 0) {
            mapping.push(this.audioOutputName);
        }

        return mapping;
    }

    build() {
        this.concatVideoWithAudioComplexFilter();
        this.concatAudioComplexFilter();
        this.concatOverlayComplexFilter();

        if (!this.finalComplexFilter.length) {
            return "";
        }

        return this.finalComplexFilter.join(";");
    }

    reset() {
        console.log("reset called");

        this.audioCount = 0;
        this.videoCount = 0;
        this.overlayCount = 0;
        this.videoWithAudioCount = 0;
        this.audioOutputName = "a_out";
        this.videoOutputName = "";
        this.audioComplexFilter = [];
        this.videoComplexFilter = [];
        this.overlayComplexFilter = "";
        this.videoWithAudioComplexFilter = [];
        this.finalComplexFilter = [];
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
        if (this.overlayCount > 1) {
            this.finalComplexFilter.push(this.overlayComplexFilter.slice(0, -1));
        } else {
            this.finalComplexFilter.push(this.overlayComplexFilter);
        }
    }

    private incrementVideoWithAudioCount() {
        this.videoWithAudioCount++;
    }

    private incrementAudioCount() {
        this.audioCount++;
    }
}

import { RenderingStrategy } from "../../../core/strategies/RenderingStrategy";
import { Template } from "../VideoFactory/VideoFactory";

export class ConcatenationRenderingStrategy implements RenderingStrategy<Template> {
    async render(template: Template) {
        if (template.useFrames) {
            await this.decompressVideos();
        }

        console.log("Rendering frames...");

        const ffmpegCommand = ffmpeg();
        const filterComplex: string[] = [];
        let inputIndex = 0;

        const processElement = (element: BaseElement, track: number) => {
            if (element instanceof Composition && element.elements?.length) {
                element.elements.forEach((subElement) => {
                    processElement(subElement, element.track); // Recursive call
                });
            } else {
                if (element instanceof Video) {
                    const video = this.assets.find((x) => element.id === x.id);
                    console.log(video, "video");

                    if (!video) {
                        return;
                    }

                    if (template.useFrames) {
                        if (video.decompressPath) {
                            ffmpegCommand.input(video.decompressPath);
                        }
                        // Process as frame sequences
                        ffmpegCommand.inputOptions(["-framerate", template.fps.toString()]);
                        filterComplex.push(`[${inputIndex}:v:0]`);
                    } else {
                        ffmpegCommand.input(video.sourcePath);
                        // Process as regular video files
                        filterComplex.push(`[${inputIndex}:v:0] [${inputIndex}:a:0]`);
                    }
                    inputIndex++;
                }
            }
        };

        template.elements.forEach((element) => {
            processElement(element, 1); // Assuming default track is 1
        });

        if (filterComplex.length > 0) {
            const concatFilter = template.useFrames
                ? filterComplex.join(" ") + `concat=n=${inputIndex}:v=1:a=0 [v]`
                : filterComplex.join(" ") + `concat=n=${inputIndex}:v=1:a=1 [v] [a]`;

            ffmpegCommand.complexFilter(concatFilter, template.useFrames ? ["v"] : ["v", "a"]);
        }

        console.log(
            "Constructed FFmpeg command:",
            ffmpegCommand._getArguments().join(" "),
            "ffmpegCommand"
        );

        ffmpegCommand
            .videoCodec("libx264")
            .outputOptions(["-pix_fmt yuv420p"])
            .fps(template.fps)
            .on("end", () => console.log("Video rendered"))
            .on("error", (err: Error) => console.log("Error: " + err.message))
            .save(getAssetsPath("out/refactor-video.mp4"));
    }
}

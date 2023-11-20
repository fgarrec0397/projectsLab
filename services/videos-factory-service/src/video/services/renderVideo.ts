import { Canvas, loadImage, registerFont } from "canvas";
import ffmpegStatic from "ffmpeg-static";
import { setFfmpegPath } from "fluent-ffmpeg";
import fs from "fs";

import { getAssetsPath } from "../../core/utils/getAssetsPath";
import { renderMainComposition } from "../compositions/renderMainComposition";
import { getVideoFrameReader } from "../utils/getVideoFrameReader";
import { stitchFramesToVideo } from "../utils/stitchFramesToVideo";

// Tell fluent-ffmpeg where it can find FFmpeg
setFfmpegPath(ffmpegStatic || "");

export const renderVideo = async () => {
    // Clean up the temporary directories first
    for (const path of [getAssetsPath("out"), getAssetsPath("tmp/output")]) {
        if (fs.existsSync(path)) {
            await fs.promises.rm(path, { recursive: true });
        }
        await fs.promises.mkdir(path, { recursive: true });
    }

    // The video length and frame rate, as well as the number of frames required
    // to create the video
    const duration = 9.15;
    const frameRate = 60;
    const frameCount = Math.floor(duration * frameRate);

    console.log("Extracting frames from video 1...");
    console.log({
        path: getAssetsPath("pexels-4782135.mp4"),
        tmpPath: getAssetsPath("tmp/video-1"),
        fameRate: frameRate,
    });

    const getVideo1Frame = await getVideoFrameReader(
        getAssetsPath("pexels-4782135.mp4"),
        getAssetsPath("tmp/video-1"),
        frameRate
    );

    console.log("Extracting frames from video 2...");
    const getVideo2Frame = await getVideoFrameReader(
        getAssetsPath("pexels-3576378.mp4"),
        getAssetsPath("tmp/video-2"),
        frameRate
    );

    console.log("Extracting frames from video 3...");
    const getVideo3Frame = await getVideoFrameReader(
        getAssetsPath("pexels-2829177.mp4"),
        getAssetsPath("tmp/video-3"),
        frameRate
    );

    const canvas = new Canvas(1280, 720);
    const context = canvas.getContext("2d");

    const logo = await loadImage(getAssetsPath("logo.svg"));

    registerFont(getAssetsPath("caveat-medium.ttf"), { family: "Caveat" });
    registerFont(getAssetsPath("chivo-regular.ttf"), { family: "Chivo" });

    // Render each frame
    for (let i = 0; i < frameCount; i++) {
        const time = i / frameRate;

        // eslint-disable-next-line no-console
        console.log(`Rendering frame ${i} at ${Math.round(time * 10) / 10} seconds...`);

        // Clear the canvas with a white background color. This is required as we are
        // reusing the canvas with every frame
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Grab a frame from our input videos
        const image1 = await getVideo1Frame();
        const image2 = await getVideo2Frame();
        const image3 = await getVideo3Frame();

        renderMainComposition(
            context,
            image1,
            image2,
            image3,
            logo,
            canvas.width,
            canvas.height,
            time
        );

        // Store the image in the directory where it can be found by FFmpeg
        const output = canvas.toBuffer("image/png");
        const paddedNumber = String(i).padStart(4, "0");
        await fs.promises.writeFile(getAssetsPath(`tmp/output/frame-${paddedNumber}.png`), output);
    }

    // Stitch all frames together with FFmpeg
    await stitchFramesToVideo(
        getAssetsPath("tmp/output/frame-%04d.png"),
        getAssetsPath("catch-up-loop-119712.mp3"),
        getAssetsPath("out/video.mp4"),
        duration,
        frameRate
    );
};

import { google } from "@google-cloud/speech/build/protos/protos";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { loadJson } from "../../../core/utils/loadJson";
import { Template, VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { mapSubtitles } from "../../utils/mappers/mapSubtitles";

const text = `Did you know that honey can last for thousands of years? Archaeologists found honey in Egyptian tombs over 3,000 years old, and it's still good to eat! Did you know octopuses have three hearts? Two pump blood to their gills and one to the rest of the body. Ever heard of a "flamboyance"? That's what you call a group of flamingos. And get this, the shortest war ever was between Britain and Zanzibar in 1896, lasting only 38 minutes! Here's a tricky one: did you know bananas are actually berries, but strawberries aren't? In the botanical world, a berry comes from a single flower's ovary and has seeds in its flesh.

Did you know the Eiffel Tower grows in summer? It can get 15 cm taller because of the heat expanding the iron. Think there are more stars in the Milky Way or trees on Earth? Earth wins with over 3 trillion trees! Cows have best friends too, and they get stressed if separated. Here's a wild one: the guy who invented the Frisbee turned into one after he died – his ashes were made into a Frisbee in 2010. Lastly, a jiffy isn't just quick, it's a real time unit, exactly 1/100th of a second. Bet you didn't know all of these!`;

const timedSubtitles = loadJson<[google.cloud.speech.v1.IRecognizeResponse]>(
    getAssetsPath("mock-voiceover-subtitles.json")
);

const subtitles = mapSubtitles(timedSubtitles?.[0]);

console.log(getAssetsPath("video1.mp4"), `getAssetsPath("video1.mp4")`);

export const funFactsTemplate: Template = {
    // duration: 46,
    fps: 60,
    outputFormat: "mp4",
    width: 1080,
    height: 1920,
    elements: [
        new VideoRenderer.Composition({
            name: "comp 1",
            track: 1,
            elements: [
                new VideoRenderer.Video({
                    name: "video1",
                    sourcePath: getAssetsPath("video1.mp4"),
                    start: 0,
                    end: 10,
                }),
                new VideoRenderer.Video({
                    name: "video2",
                    sourcePath: getAssetsPath("video2.mp4"),
                    start: 10,
                    end: 25,
                }),
                new VideoRenderer.Video({
                    name: "video3",
                    sourcePath: getAssetsPath("video3.mp4"),
                    start: 25,
                    end: 35,
                }),
                new VideoRenderer.Video({
                    name: "video4",
                    sourcePath: getAssetsPath("video4.mp4"),
                    start: 35,
                    end: 45,
                }),
            ],
        }),
        new VideoRenderer.Audio({
            name: "audio1",
            sourcePath: getAssetsPath("background-music-Blade-Runner2049.mp3"),
        }),
        new VideoRenderer.Audio({
            name: "audio1",
            sourcePath: getAssetsPath("speech.mp3"),
        }),
        new VideoRenderer.Text({
            name: "text",
            value: "My text",
        }),
    ],
};

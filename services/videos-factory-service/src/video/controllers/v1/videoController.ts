import speech from "@google-cloud/speech";
import { Request, Response } from "express";
import fs from "fs";
import OpenAI from "openai";
import path from "path";

import { VideoUtils } from "../../modules/VideoRenderer/Utilities/VideoUtils";
import { VideoRenderer } from "../../modules/VideoRenderer/VideoRenderer";
import { funFactsTemplate } from "../../templates/funFactsTemplate/funFactsTemplate";

const client = new speech.SpeechClient({
    keyFile: path.resolve("./credentials/video-factory-405519-9554aeeae820.json"),
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const input = `Did you know that honey can last for thousands of years? Archaeologists found honey in Egyptian tombs over 3,000 years old, and it's still good to eat! Did you know octopuses have three hearts? Two pump blood to their gills and one to the rest of the body. Ever heard of a "flamboyance"? That's what you call a group of flamingos. And get this, the shortest war ever was between Britain and Zanzibar in 1896, lasting only 38 minutes! Here's a tricky one: did you know bananas are actually berries, but strawberries aren't? In the botanical world, a berry comes from a single flower's ovary and has seeds in its flesh.

Did you know the Eiffel Tower grows in summer? It can get 15 cm taller because of the heat expanding the iron. Think there are more stars in the Milky Way or trees on Earth? Earth wins with over 3 trillion trees! Cows have best friends too, and they get stressed if separated. Here's a wild one: the guy who invented the Frisbee turned into one after he died – his ashes were made into a Frisbee in 2010. Lastly, a jiffy isn't just quick, it's a real time unit, exactly 1/100th of a second. Bet you didn't know all of these!`;

const convertMp3ToBuffer = (filePath: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            console.log("convertMp3ToBuffer finished");

            resolve(data);
        });
    });
};

class VideoController {
    async get(request: Request, result: Response) {
        // const speechFilePath = path.resolve("./assets/speech.mp3");
        // const resampledSpeechFilePath = path.resolve("./assets/speech-resampled.mp3");

        // console.log("Create audio with OpenAI");
        // const mp3 = await openai.audio.speech.create({
        //     model: "tts-1-hd",
        //     voice: "alloy",
        //     input,
        // });
        // // const resampledMP3;
        // const buffer = Buffer.from(await mp3.arrayBuffer());
        // await fs.promises.writeFile(speechFilePath, buffer);
        // // await fs.promises.writeFile(resampledSpeechFilePath, buffer);

        // console.log("Resample the audio");
        // await VideoUtils.resampleAudio(speechFilePath, resampledSpeechFilePath);
        // const resampledBuffer = await convertMp3ToBuffer(resampledSpeechFilePath);

        // console.log("Create the timestamps with google");
        // const resultGoogle = await client.recognize({
        //     audio: { content: resampledBuffer },
        //     config: {
        //         encoding: "MP3",
        //         sampleRateHertz: 16000,
        //         languageCode: "en-US",
        //         enableWordTimeOffsets: true,
        //         model: "latest_long",
        //         useEnhanced: true,
        //         // enableSpokenPunctuation: {
        //         //     value: true,
        //         // },
        //     },
        // });

        // // console.log(resultGoogle[0].results?.[0].alternatives?.[0], "resultGoogle");
        // // console.log(resultGoogle[0].results, "resultGoogle");
        // console.log(JSON.stringify(resultGoogle), "resultGoogle");

        const videoFactory = new VideoRenderer(funFactsTemplate);

        await videoFactory.initRender();
        result.status(200).json({ result: "video controller GET" });
    }
}

export default new VideoController();

import speech from "@google-cloud/speech";
import { Request, Response } from "express";
import fs from "fs";
import OpenAI from "openai";
import path from "path";

const client = new speech.SpeechClient({
    keyFile: path.resolve("./credentials/video-factory-405519-9554aeeae820.json"),
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const input = `Did you know that honey can last for thousands of years? Archaeologists found honey in Egyptian tombs over 3,000 years old, and it's still good to eat! Did you know octopuses have three hearts? Two pump blood to their gills and one to the rest of the body. Ever heard of a "flamboyance"? That's what you call a group of flamingos. And get this, the shortest war ever was between Britain and Zanzibar in 1896, lasting only 38 minutes! Here's a tricky one: did you know bananas are actually berries, but strawberries aren't? In the botanical world, a berry comes from a single flower's ovary and has seeds in its flesh.

Did you know the Eiffel Tower grows in summer? It can get 15 cm taller because of the heat expanding the iron. Think there are more stars in the Milky Way or trees on Earth? Earth wins with over 3 trillion trees! Cows have best friends too, and they get stressed if separated. Here's a wild one: the guy who invented the Frisbee turned into one after he died – his ashes were made into a Frisbee in 2010. Lastly, a jiffy isn't just quick, it's a real time unit, exactly 1/100th of a second. Bet you didn't know all of these!`;

const get = async (request: Request, result: Response) => {
    const videoControllerActivated = true;

    if (videoControllerActivated) {
        const speechFile = path.resolve("./assets/speech.mp3");

        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "alloy",
            input,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);

        const resultGoogle = await client.recognize({
            audio: { content: buffer },
            config: {
                encoding: "MP3",
                // sampleRateHertz: 16000,
                languageCode: "en-US",
                enableWordTimeOffsets: true,
            },
        });

        console.log(resultGoogle[0].results?.[0].alternatives?.[0], "resultGoogle");
        console.log(resultGoogle[0].results, "resultGoogle");
        console.log(JSON.stringify(resultGoogle), "resultGoogle");
    }

    result.status(200).json({ result: "video controller GET" });
};

export default {
    get,
};

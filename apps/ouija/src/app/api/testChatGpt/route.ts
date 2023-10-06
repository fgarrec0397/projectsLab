import { exec } from "child_process";
import fs from "fs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import util from "util";

const execAsync = util.promisify(exec);

import { getOpenAiApiKey } from "@/config/envConfig";
import { getInitialPrompt } from "@/config/promptsConfig";
import entities from "@/data/entities";

const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

export const GET = async () => {
    const prompt = getInitialPrompt(entities[0]);

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices[0].message, "chatCompletion message");

    return NextResponse.json({ message: chatCompletion.choices[0].message }, { status: 200 });
};

export const POST = async (request: Request) => {
    const req = await request.json();
    const base64Audio = req.audio;

    const audio = Buffer.from(base64Audio, "base64");
    try {
        const text = await convertAudioToText(audio);

        return NextResponse.json({ result: text }, { status: 200 });
    } catch (error: any) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            return NextResponse.json({ error: error.response.data }, { status: 500 });
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return NextResponse.json(
                { error: "An error occurred during your request." },
                { status: 500 }
            );
        }
    }
};

async function convertAudioToText(audioData: Buffer) {
    const mp3AudioData = await convertAudioToMp3(audioData);
    const outputPath = "/tmp/output.mp3";

    fs.writeFileSync(outputPath, mp3AudioData);

    const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream(outputPath),
        model: "whisper-1",
    });

    fs.unlinkSync(outputPath);

    return response.text;
}

async function convertAudioToMp3(audioData: Buffer) {
    const inputPath = "/tmp/input.webm";
    const outputPath = "/tmp/output.mp3";

    fs.writeFileSync(inputPath, audioData);

    await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);

    const mp3AudioData = fs.readFileSync(outputPath);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return mp3AudioData;
}

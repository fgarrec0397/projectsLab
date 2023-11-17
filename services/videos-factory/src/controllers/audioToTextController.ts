import { exec } from "child_process";
import { Request, Response } from "express";
import { createReadStream, readFileSync, unlinkSync, writeFileSync } from "fs";
import OpenAI from "openai";
import util from "util";

const execAsync = util.promisify(exec);

async function convertAudioToText(audioData: Buffer) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const mp3AudioData = await convertAudioToMp3(audioData);
    const outputPath = "/tmp/output.mp3";

    writeFileSync(outputPath, mp3AudioData);

    const response = await openai.audio.transcriptions.create({
        file: createReadStream(outputPath),
        model: "whisper-1",
    });

    unlinkSync(outputPath);

    return response.text;
}

async function convertAudioToMp3(audioData: Buffer) {
    const inputPath = "/tmp/input.webm";
    const outputPath = "/tmp/output.mp3";

    writeFileSync(inputPath, audioData);

    await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);

    const mp3AudioData = readFileSync(outputPath);

    unlinkSync(inputPath);
    unlinkSync(outputPath);

    return mp3AudioData;
}

const post = async (request: Request, result: Response) => {
    const base64Audio = request.body.audio;

    const audio = Buffer.from(base64Audio, "base64");

    try {
        const text = await convertAudioToText(audio);

        result.json({ result: text });
    } catch (error) {
        console.error(error);
        result.status(500).json({ error: "An error occurred during audio conversion." });
    }
};

export default {
    post,
};

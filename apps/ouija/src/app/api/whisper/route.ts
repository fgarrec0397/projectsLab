// import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { exec, spawn } from "child_process";
// import ffmpeg from "ffmpeg-static";
import fs from "fs";
import { NextResponse } from "next/server";
import util from "util";
// const ffmpegPath = path; // Use the path from the @ffmpeg-installer/ffmpeg package

const execAsync = util.promisify(exec);

import OpenAI from "openai";
import path from "path";

import { getOpenAiApiKey } from "@/config/envConfig";

const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

export const POST = async (request: Request) => {
    const req = await request.json();
    const base64Audio = req.audio;
    // console.log(ffmpeg, "ffmpeg");

    console.log("Whisper POST");

    const audio = Buffer.from(base64Audio, "base64");
    try {
        console.log("Whisper try");
        const text = await convertAudioToText(audio);
        console.log("Whisper try after convertAudioToText");

        return NextResponse.json({ result: text }, { status: 200 });
    } catch (error: any) {
        if (error.response) {
            console.log("Whisper catch");
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
    console.log("convertAudioToText");

    const mp3AudioData = await convertAudioToMp3(audioData);
    console.log("convertAudioToText after convertAudioToMp3");
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
    const ffmpegPath = path.join(process.cwd(), "src", "libs", "ffmpeg.exe");

    const ffmpegProcess = spawn(ffmpegPath, ["-i", inputPath, outputPath]);

    return new Promise<Buffer>((resolve, reject) => {
        ffmpegProcess.on("exit", (code) => {
            if (code === 0) {
                const mp3AudioData = fs.readFileSync(outputPath);
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
                resolve(mp3AudioData);
            } else {
                reject(new Error(`FFmpeg command failed with code ${code}`));
            }
        });
    });
}

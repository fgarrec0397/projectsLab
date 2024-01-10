import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    DeleteTranscriptionJobCommand,
    GetTranscriptionJobCommand,
    StartTranscriptionJobCommand,
    StartTranscriptionJobCommandInput,
    TranscribeClient,
} from "@aws-sdk/client-transcribe";
import fs from "fs";

import { getAssetsPath } from "../../../core/utils/getAssetsPath";
import { TimedText } from "../../utils/mappers/mapSubtitles";
import { TimestampsGeneratorStrategy } from "./Strategies/TimestampsGeneratorStrategy/TimestampsGeneratorStrategy";
import { VoiceGeneratorStrategy } from "./Strategies/VoiceGeneratorStrategy/VoiceGeneratorStrategy";

const credentials = {
    accessKeyId: process.env.AWS_TRANSCRIBE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_TRANSCRIBE_SECRET_ACCESS_KEY || "",
};

async function waitForTranscriptionToComplete(transcribeClient: TranscribeClient, jobName: string) {
    console.log(jobName, "jobName");

    let status = "IN_PROGRESS";

    while (status === "IN_PROGRESS") {
        const job = await transcribeClient.send(
            new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
        );

        if (!job.TranscriptionJob) {
            return;
        }

        status = job.TranscriptionJob.TranscriptionJobStatus || "IN_PROGRESS";

        if (status === "COMPLETED") {
            console.log("Transcription completed.");
            return job.TranscriptionJob.Transcript;
        } else if (status === "FAILED") {
            console.error("Transcription failed:", job.TranscriptionJob.FailureReason);
            return null;
        }

        // Wait for some time before polling again
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
    }
}

export class ScriptManager {
    subtitles: TimedText[] = [];

    private voiceBuffer: Buffer | undefined;

    private voiceFilePath: string = getAssetsPath("speech.flac");

    private text: string | undefined;

    private voiceGeneratorStrategy: VoiceGeneratorStrategy;

    private timestampsGeneratorStrategy: TimestampsGeneratorStrategy;

    constructor(
        voiceGeneratorStrategy: VoiceGeneratorStrategy,
        timestampsGeneratorStrategy: TimestampsGeneratorStrategy
    ) {
        this.voiceGeneratorStrategy = voiceGeneratorStrategy;
        this.timestampsGeneratorStrategy = timestampsGeneratorStrategy;
    }

    async generateScript() {
        await this.generateText();
        await this.generateVoice();
        await this.generateTimestampsBasedOnAudio();
    }

    private async generateText() {
        // TODO - Generate the text via openAI, this temporary mocked data
        this.text = `Did you know that honey can last for thousands of years? Archaeologists found honey in Egyptian tombs over 3,000 years old, and it's still good to eat! Did you know octopuses have three hearts? Two pump blood to their gills and one to the rest of the body. Ever heard of a "flamboyance"? That's what you call a group of flamingos. And get this, the shortest war ever was between Britain and Zanzibar in 1896, lasting only 38 minutes! Here's a tricky one: did you know bananas are actually berries, but strawberries aren't? In the botanical world, a berry comes from a single flower's ovary and has seeds in its flesh. Did you know the Eiffel Tower grows in summer? It can get 15 cm taller because of the heat expanding the iron. Think there are more stars in the Milky Way or trees on Earth? Earth wins with over 3 trillion trees! Cows have best friends too, and they get stressed if separated. Here's a wild one: the guy who invented the Frisbee turned into one after he died – his ashes were made into a Frisbee in 2010. Lastly, a jiffy isn't just quick, it's a real time unit, exactly 1/100th of a second. Bet you didn't know all of these!`;
    }

    private async generateVoice() {
        if (!this.text) {
            return;
        }

        this.voiceBuffer = await this.voiceGeneratorStrategy.generateVoice(
            this.text,
            this.voiceFilePath
        );
        await fs.promises.writeFile(this.voiceFilePath, this.voiceBuffer);
    }

    private async generateTimestampsBasedOnAudio() {
        if (!this.voiceBuffer) {
            return;
        }

        const region = "us-east-1";

        console.log(credentials, "credentials");

        const transcriptionJobName = "my-first-transcription-job";

        const input: StartTranscriptionJobCommandInput = {
            TranscriptionJobName: transcriptionJobName,
            LanguageCode: "en-US",
            // MediaFormat: "flac",
            Media: {
                MediaFileUri: `s3://video-factory-bucket/my-input-files/speech.flac`,
            },
            OutputBucketName: "video-factory-bucket",
        };

        const transcribeConfig = {
            region,
            credentials,
        };

        const s3Client = new S3Client({ region, credentials });

        const bucketName = "video-factory-bucket";
        // const fileName = getAssetsPath("speech.mp3"); // Your local file name
        const fileName = "speech.flac"; // Your local file name
        const fileContent = fs.readFileSync(getAssetsPath(fileName));

        // Upload the file to S3
        const uploadParams = {
            Bucket: bucketName,
            Key: "my-input-files/" + fileName, // S3 object key
            Body: fileContent,
        };

        // const createBucketParams = { Bucket: bucketName };

        // try {
        //     const data = await s3Client.send(new CreateBucketCommand(createBucketParams));
        //     console.log("Success", data);
        // } catch (err) {
        //     console.error("Error", err);
        // }

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            console.log(`File uploaded successfully to s3://${bucketName}/${uploadParams.Key}`);
        } catch (err) {
            console.error("Error uploading file:", err);
            return;
        }

        const transcribeClient = new TranscribeClient(transcribeConfig);
        const transcribeCommand = new StartTranscriptionJobCommand(input);

        try {
            await transcribeClient.send(
                new DeleteTranscriptionJobCommand({ TranscriptionJobName: transcriptionJobName })
            );
        } catch {
            console.log("Job not exist");
        }

        const transcribeResponse = await transcribeClient.send(transcribeCommand);
        console.log("Transcription job created, the details:");
        console.log(JSON.stringify(transcribeResponse.TranscriptionJob));

        const transcript = await waitForTranscriptionToComplete(
            transcribeClient,
            transcriptionJobName
        );
        if (transcript) {
            console.log("Transcript:", transcript);
            // If you have specified an OutputBucketName, the transcript file URI will be in transcript.TranscriptFileUri
        }

        // this.subtitles = await this.timestampsGeneratorStrategy.generateTimestampsBasedOnAudio(
        //     this.voiceBuffer
        // );
    }
}

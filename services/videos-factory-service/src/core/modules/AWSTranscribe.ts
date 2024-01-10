import speech, { SpeechClient } from "@google-cloud/speech";
import path from "path";

const region = "us-west-2";
const credentials = {
    accessKeyId: "AKIAZPEHDTQXOWZB6QU7",
    secretAccessKey: "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",
};

const input = {
    TranscriptionJobName: "my-first-transcription-job",
    LanguageCode: "en-US",
    Media: {
        MediaFileUri: "s3://DOC-EXAMPLE-BUCKET/my-input-files/my-media-file.flac",
    },
    OutputBucketName: "DOC-EXAMPLE-BUCKET",
};

const transcribeConfig = {
    region,
    credentials,
};

export class AWSTranscribeModule {
    private static instance: SpeechClient;

    public static getModule(): SpeechClient {
        if (!GoogleCloudSpeechModule.instance) {
            GoogleCloudSpeechModule.instance = new speech.SpeechClient({
                keyFile: path.resolve("./credentials/video-factory-405519-9554aeeae820.json"),
            });
        }
        return GoogleCloudSpeechModule.instance;
    }
}

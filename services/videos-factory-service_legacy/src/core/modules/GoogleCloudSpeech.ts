import speech, { SpeechClient } from "@google-cloud/speech";
import path from "path";

export class GoogleCloudSpeechModule {
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

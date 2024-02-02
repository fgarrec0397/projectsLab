import { createClient, DeepgramClient } from "@deepgram/sdk";

export class DeepgramModule {
    private static instance: DeepgramClient;

    public static getModule(): DeepgramClient {
        if (!DeepgramModule.instance) {
            DeepgramModule.instance = createClient(process.env.DEEPGRAM_API_KEY || "");
        }

        return DeepgramModule.instance;
    }
}

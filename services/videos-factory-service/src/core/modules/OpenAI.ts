import OpenAI from "openai";

export class OpenAIModule {
    private static instance: OpenAI;

    public static getModule(): OpenAI {
        if (!OpenAIModule.instance) {
            OpenAIModule.instance = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }
        return OpenAIModule.instance;
    }
}

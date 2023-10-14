import OpenAI from "openai";

import { getOpenAiApiKey } from "@/config/envConfig";

export const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

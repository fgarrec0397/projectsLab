import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";

import { getOpenAiApiKey } from "@/config/envConfig";
import { getInitialPrompt } from "@/config/promptsConfig";
import entities from "@/data/entities";

const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

type ResponseData = {
    message: ChatCompletionMessageParam;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const prompt = getInitialPrompt(entities[0]);

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices[0].message, "chatCompletion message");

    res.status(200).json({ message: chatCompletion.choices[0].message });
}

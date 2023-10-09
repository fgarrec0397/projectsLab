import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getOpenAiApiKey } from "@/config/envConfig";
import { getInitialPrompt } from "@/config/promptsConfig";
import entities from "@/data/entities";

const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

export const POST = async (request: Request) => {
    const prompt = getInitialPrompt(entities[0]);
    const requestJson = await request.json();
    const requestMessages = requestJson.messages;
    const messages = [
        {
            role: "user",
            content: prompt,
        },
        ...requestMessages,
    ];

    const messagesMapped = messages.filter((x) => x !== null || x !== undefined);

    const chatCompletion = await openai.chat.completions.create({
        messages: messagesMapped,
        model: "gpt-3.5-turbo",
    });

    return NextResponse.json(chatCompletion.choices[0].message);
};

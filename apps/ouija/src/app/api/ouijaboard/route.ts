import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getOpenAiApiKey } from "@/config/envConfig";
import { getInitialPrompt } from "@/config/promptsConfig";
import entities from "@/data/entities";

const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
});

export const GET = async () => {
    const prompt = getInitialPrompt(entities[0]);

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices[0].message, "chatCompletion message");

    return NextResponse.json(chatCompletion.choices[0].message, { status: 200 });
};

export const POST = async (request: Request) => {
    const requestJson = await request.json();
    const messages = requestJson.messages;

    console.log(messages, "messages");
    const chatCompletion = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
    });

    return NextResponse.json(chatCompletion.choices[0].message);
};

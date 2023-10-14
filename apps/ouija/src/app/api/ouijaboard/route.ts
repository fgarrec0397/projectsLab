import { NextResponse } from "next/server";

import { openai } from "@/config/openAiConfig";
import { getInitialPrompt } from "@/config/promptsConfig";
import entities from "@/data/entities";

export const POST = async (request: Request) => {
    const requestJson = await request.json();
    const requestMessages = requestJson.messages;
    const requestEntityIndex = requestJson.entityIndex;
    console.log(requestJson, "requestJson");

    const prompt = getInitialPrompt(entities[requestEntityIndex]);
    const messages = [
        {
            role: "user",
            content: prompt,
        },
        ...requestMessages,
    ];

    const messagesMapped = messages.filter((x) => x !== null || x !== undefined);

    console.log(messagesMapped, "messagesMapped");

    const chatCompletion = await openai.chat.completions.create({
        messages: messagesMapped,
        model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices[0].message);

    return NextResponse.json(chatCompletion.choices[0].message);
};

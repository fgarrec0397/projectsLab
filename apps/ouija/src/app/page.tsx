"use client";

import { Fetcher, useQuery } from "@projectslab/helpers";
import { ChatCompletionMessage, ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";
import { useEffect, useState } from "react";

import Microphone from "@/features/Microphone/Microphone";
import Ouijaboard from "@/features/Ouijaboard/Ouijaboard";
import Palette from "@/features/Palette/Palette";

const questions: string[] = ["is anybody here", "what is your name"];

type GetChatParams = {
    message: ChatCompletionMessage;
};

export default function Home() {
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

    // const { data, status } = useQuery({
    //     queryKey: ["chat"],
    //     queryFn: () => Fetcher.get<GetChatParams>("/api/testChatGpt"),
    // });

    // useEffect(() => {
    //     if (status === "success") {
    //         setMessages((prev) => {
    //             return [...prev, data.data.message];
    //         });
    //     }
    // }, [data, status]);

    return (
        <main>
            <Palette />
            <Ouijaboard />
            <Microphone />
        </main>
    );
}

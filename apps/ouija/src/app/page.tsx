"use client";

import { Fetcher } from "@projectslab/helpers";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";
import { useEffect, useState } from "react";

import Ouijaboard from "@/components/Ouijaboard/Ouijaboard";
import Palette from "@/components/Palette/Palette";

const questions: string[] = ["is anybody here", "what is your name"];

export default function Home() {
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

    useEffect(() => {
        const fetchTestChatGpt = async () => {
            const data = await Fetcher.post<any>("/api/testChatGpt", {
                messages,
            });
            // const data = await fetch("/api/testChatGpt", { cache: "no-store" });
            // const response = await data.json();
            console.log(data, "data");
        };

        fetchTestChatGpt();
    }, [messages]);

    return (
        <main>
            <Palette />
            <Ouijaboard />
        </main>
    );
}

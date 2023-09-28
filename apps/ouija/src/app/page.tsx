"use client";

import { useEffect } from "react";

import Ouijaboard from "@/components/Ouijaboard/Ouijaboard";
import Palette from "@/components/Palette/Palette";

export default function Home() {
    useEffect(() => {
        const fetchTestChatGpt = async () => {
            const data = await fetch("/api/testChatGpt", { cache: "no-store" });
            const response = data.json();
            console.log(response, "response");
        };

        fetchTestChatGpt();
    }, []);

    return (
        <main>
            <Palette />
            <Ouijaboard />
        </main>
    );
}

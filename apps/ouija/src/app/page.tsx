"use client";

import Microphone from "@/features/Microphone/Microphone";
import Ouijaboard from "@/features/Ouijaboard/Ouijaboard";
import Palette from "@/features/Palette/Palette";

export default function Home() {
    return (
        <main>
            <Palette />
            <Ouijaboard />
            <Microphone />
        </main>
    );
}

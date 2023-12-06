"use client";

import { Fetcher } from "@projectslab/helpers";
import { Button } from "@ui/components";

export default function Home() {
    const onClickHandler = async () => {
        await Fetcher.get("/api/video");
    };

    return (
        <main>
            <Button onClick={onClickHandler} variant="contained">
                Test
            </Button>
        </main>
    );
}

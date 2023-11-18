"use client";

import { Fetcher } from "@projectslab/helpers";
import { Button } from "@ui/components";

export default function Home() {
    const onClickHandler = async () => {
        console.log("onClickHandler");
        const response = await Fetcher.get("/api/video");
        console.log(response, "response");
    };

    return (
        <main>
            <Button onClick={onClickHandler} variant="contained">
                Test
            </Button>
        </main>
    );
}

"use client";

import { Button } from "@ui/components";

export default function Home() {
    const onClickHandler = () => {
        console.log("onClickHandler");
    };

    return (
        <main>
            <Button onClick={onClickHandler} variant="contained">
                Test
            </Button>
        </main>
    );
}

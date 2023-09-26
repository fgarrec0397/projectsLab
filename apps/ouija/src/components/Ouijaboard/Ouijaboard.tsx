"use client";

import { Box, BoxProps, Button } from "@projectslab/ui";
import Image from "next/image";
import { FC } from "react";

import InteractiveOverlay from "./InteractiveOverlay";

type OuijaboardStyles = {
    imageWrapper?: BoxProps;
};

const styles: OuijaboardStyles = {
    imageWrapper: {
        sx: {
            position: "relative",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
    },
};

const lettersArray = [
    {
        id: "yes",
        value: "Yes",
        position: [114, 328],
    },
    {
        id: "no",
        value: "No",
        position: [103, 1059],
    },
    {
        id: "a",
        value: "A",
        position: [364, 129],
    },
    {
        id: "b",
        value: "B",
        position: [317, 229],
    },
    {
        id: "v",
        value: "V",
        position: [450, 1108],
    },
];

const Ouijaboard: FC = () => {
    function moveCursorTo(idElement: string) {
        const cursor = document.getElementById("cursor");
        const currentElement = document.getElementById(idElement);
        const left = currentElement?.getBoundingClientRect().left;
        const top = currentElement?.getBoundingClientRect().top;

        if (!cursor || !left || !top) {
            return;
        }

        cursor.style.transition = "left 0.3s ease, top 0.3s ease";
        cursor.style.left = `${left}px`;
        cursor.style.top = `${top}px`;

        // Add animation classes or transitions here
    }
    const onClickTest = () => {
        lettersArray.forEach((letter, index) => {
            setTimeout(() => {
                moveCursorTo(letter.id);
            }, index * 3000); // Delay between movements (adjust as needed)
        });

        const cursor = document.getElementById("cursor");
        if (cursor) {
            cursor.style.transition = "unset";
        }
    };

    return (
        <>
            <Box {...styles.imageWrapper}>
                <InteractiveOverlay />
                <Button
                    onClick={onClickTest}
                    variant="contained"
                    sx={{
                        position: "absolute",
                        bottom: 100,
                    }}
                >
                    Test
                </Button>
                <Image src="/Ouijaboard.jpg" alt="ouija board" width={1344} height={896} />
            </Box>
        </>
    );
};

export default Ouijaboard;

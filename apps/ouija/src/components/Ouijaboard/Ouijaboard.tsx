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

const Ouijaboard: FC = () => {
    const onClickTest = () => {
        console.log("test");
        document.addEventListener("click", () => {
            lettersArray.forEach((letter, index) => {
                setTimeout(() => {
                    moveCursorTo(letter);
                }, index * 1000); // Delay between movements (adjust as needed)
            });
        });
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

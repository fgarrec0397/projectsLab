"use client";

import { CSSProperties, FC, PropsWithChildren, useEffect, useState } from "react";

type PaletteStyles = {
    palette?: CSSProperties;
};

const styles: PaletteStyles = {
    palette: {
        position: "absolute",
        width: "384px",
        height: "391px",
        backgroundImage: `url("/palette.png")` /* Replace with the path to your cursor image */,
        backgroundSize: "cover",
        pointerEvents: "none" /* Allows clicks to pass through the cursor */,
        zIndex: 1,
        transition: "transform 0.3s ease",
    },
};

const Palette: FC<PropsWithChildren> = () => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            const newX = e.clientX;
            const deltaY = newX - cursorPosition.x;

            // Calculate rotation angle based on cursor movement
            const newRotation = deltaY * 10; // Adjust the factor for desired rotation speed

            setCursorPosition({ x: newX, y: e.clientY });
            setRotation(newRotation);
        };

        document.addEventListener("mousemove", moveCursor);

        return () => {
            document.removeEventListener("mousemove", moveCursor);
        };
    }, [cursorPosition.x]);

    return (
        <div
            id="cursor"
            style={{
                left: cursorPosition.x,
                top: cursorPosition.y,
                ...styles.palette,
                transform: `translate(-50%, -65%) rotate(${rotation}deg)`,
            }}
        />
    );
};

export default Palette;

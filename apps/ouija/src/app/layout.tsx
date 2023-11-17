"use client";

import { CssBaseline } from "@ui/components";
import { ThemeProvider } from "@ui/theme";
import { PropsWithChildren } from "react";

import Core from "@/features/Core/Core";
import OuijaboardContextProvider from "@/features/Ouijaboard/_actions/_data/providers/OuijaboardProvider";
import theme from "@/theme";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <OuijaboardContextProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <html lang="en">
                    <Core>{children}</Core>
                </html>
            </ThemeProvider>
        </OuijaboardContextProvider>
    );
}

"use client";

import { CssBaseline } from "@ui/components";
import { ThemeProvider } from "@ui/theme";
import { PropsWithChildren } from "react";

import Core from "@/features/Core/Core";
import theme from "@/theme";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <html lang="en">
                <Core>{children}</Core>
            </html>
        </ThemeProvider>
    );
}

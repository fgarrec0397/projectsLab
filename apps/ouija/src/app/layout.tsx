"use client";

// import { ProvidersBuilder } from "@projectslab/helpers";
import { CssBaseline } from "@ui/components";
import { ThemeProvider } from "@ui/theme";

import Body from "@/components/Core/Body";
import theme from "@/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // const Providers = ProvidersBuilder([[ThemeProvider, { theme }]]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <html lang="en">
                <Body>{children}</Body>
            </html>
        </ThemeProvider>
    );
}

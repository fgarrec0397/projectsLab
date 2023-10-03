"use client";

import { QueryClient, QueryClientProvider } from "@projectslab/helpers";
import { CssBaseline } from "@ui/components";
import { ThemeProvider } from "@ui/theme";

import Body from "@/components/Core/Body";
import theme from "@/theme";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <html lang="en">
                    <Body>{children}</Body>
                </html>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

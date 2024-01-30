import "@/global.css";

import { AuthProvider } from "@/auth/context/firebase";
import { MotionLazy } from "@/components/animate/motion-lazy";
import ProgressBar from "@/components/progress-bar";
import { SettingsDrawer, SettingsProvider } from "@/components/settings";
// ----------------------------------------------------------------------
import ThemeProvider from "@/theme";
import { primaryFont } from "@/theme/typography";

// ----------------------------------------------------------------------

export const viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

// TODO - change metadata
export const metadata = {
    title: "Minimal UI Kit",
    description:
        "The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style",
    keywords: "react,material,kit,application,dashboard,admin,template",
    manifest: "/manifest.json",
    icons: [
        { rel: "icon", url: "/favicon/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png" },
    ],
};

type Props = {
    children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" className={primaryFont.className}>
            <body>
                <AuthProvider>
                    <SettingsProvider
                        defaultSettings={{
                            themeMode: "light", // 'light' | 'dark'
                            themeDirection: "ltr", //  'rtl' | 'ltr'
                            themeContrast: "default", // 'default' | 'bold'
                            themeLayout: "vertical", // 'vertical' | 'horizontal' | 'mini'
                            themeColorPresets: "default", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                            themeStretch: false,
                        }}
                    >
                        <ThemeProvider>
                            <MotionLazy>
                                <SettingsDrawer />
                                <ProgressBar />
                                {children}
                            </MotionLazy>
                        </ThemeProvider>
                    </SettingsProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

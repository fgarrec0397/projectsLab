import "@/global.css";
import "@/locales/i18n";

import { AuthProvider } from "@/auth/context/firebase";
import { MotionLazy } from "@/components/animate/motion-lazy";
import ProgressBar from "@/components/progress-bar";
import { SettingsDrawer, SettingsProvider } from "@/components/settings";
import { SnackbarProvider } from "@/components/snackbar";
import { LocalizationProvider } from "@/locales";
import { SocketProvider } from "@/services/socket/SocketContext";
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
    title: "Createify",
    description: "Automatically create videos while you focus on leveraging your business",
    keywords: "react,material,kit,application,dashboard,admin,template",
    manifest: "/manifest.json",
    icons: [
        { rel: "icon", url: "/favicon/favicon.ico?v=2" },
        { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png?v=2" },
        { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png?v=2" },
        { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-touch-icon.png?v=2" },
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
                    <LocalizationProvider>
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
                                    <SnackbarProvider>
                                        <SocketProvider>
                                            <SettingsDrawer />
                                            <ProgressBar />
                                            {children}
                                        </SocketProvider>
                                    </SnackbarProvider>
                                </MotionLazy>
                            </ThemeProvider>
                        </SettingsProvider>
                    </LocalizationProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

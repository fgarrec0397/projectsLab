import { Theme as ThemeLib, ThemeProvider as ThemeProviderLib } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { FC, PropsWithChildren } from "react";

export type Theme = ThemeLib;

type Props = PropsWithChildren & {
    theme: Theme;
};

const ThemeProvider: FC<Props> = ({ theme, children }) => {
    return (
        <ThemeProviderLib theme={theme}>
            <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
        </ThemeProviderLib>
    );
};

export default ThemeProvider;

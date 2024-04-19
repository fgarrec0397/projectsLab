// ----------------------------------------------------------------------

import { IconifyIcon } from "@iconify/react/dist/iconify.js";
import { BoxProps } from "@mui/material/Box";

export type IconifyProps = IconifyIcon | string;

export type IconifyComponentProps = BoxProps & {
    icon: IconifyProps;
};

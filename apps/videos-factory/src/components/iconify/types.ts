// ----------------------------------------------------------------------

import { IconifyIcon } from "@iconify/react/dist/iconify.js";
import { BoxProps } from "@mui/material/Box";

type IconifyProps = IconifyIcon | string;

export type IconifyComponentProps = BoxProps & {
    icon: IconifyProps;
};

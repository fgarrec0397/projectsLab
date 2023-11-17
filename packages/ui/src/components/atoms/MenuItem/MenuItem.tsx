"use client";

import MenuItemLib, { MenuItemProps as LibMenuItemProps } from "@mui/material/MenuItem";
import { FC } from "react";

export type MenuItemProps = LibMenuItemProps;

const MenuItem: FC<MenuItemProps> = ({ children, ...props }) => {
    return <MenuItemLib {...props}>{children}</MenuItemLib>;
};

export default MenuItem;

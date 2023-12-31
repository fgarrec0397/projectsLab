"use client";

import ListLib, { ListProps as LibListProps } from "@mui/material/List";
import ListItemLib, { ListItemProps as LibListItemProps } from "@mui/material/ListItem";
import ListItemButtonLib, {
    ListItemButtonProps as LibListItemButtonProps,
} from "@mui/material/ListItemButton";
import ListItemIconLib, {
    ListItemIconProps as LibListItemIconProps,
} from "@mui/material/ListItemIcon";
import ListItemTextLib, {
    ListItemTextProps as LibListItemTextProps,
} from "@mui/material/ListItemText";
import { FC, forwardRef } from "react";

export type ListProps = LibListProps;
export type ListItemProps = LibListItemProps;
export type ListItemButtonProps = LibListItemButtonProps;
export type ListItemIconProps = LibListItemIconProps;
export type ListItemTextProps = LibListItemTextProps;

const List: FC<ListProps> = (props) => {
    return <ListLib {...props} />;
};

export const ListItem: FC<ListItemProps> = forwardRef<HTMLLIElement, ListItemProps>(
    (props, ref) => {
        return <ListItemLib ref={ref} {...props} />;
    }
);

ListItem.displayName = "ListItem";

export const ListItemButton: FC<ListItemButtonProps> = (props) => {
    return <ListItemButtonLib {...props} />;
};

export const ListItemIcon: FC<ListItemIconProps> = (props) => {
    return <ListItemIconLib {...props} />;
};

export const ListItemText: FC<ListItemTextProps> = (props) => {
    return <ListItemTextLib {...props} />;
};

export default List;

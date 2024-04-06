import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import Link, { LinkProps } from "@mui/material/Link";
import ListItemButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";
import { m } from "framer-motion";
import { forwardRef } from "react";

import Iconify from "@/components/iconify";
import { RouterLink } from "@/routes/components";

import { NavItemProps, NavItemStateProps } from "../types";

// ----------------------------------------------------------------------

export const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
    ({ title, path, open, active, hasChild, externalLink, subItem, ...other }, ref) => {
        const renderContent = (
            <StyledNavItem
                disableRipple
                disableTouchRipple
                ref={ref}
                open={open}
                active={active}
                subItem={subItem}
                {...other}
            >
                {title}

                {hasChild && (
                    <Iconify width={16} icon="eva:arrow-ios-downward-fill" sx={{ ml: 1 }} />
                )}
            </StyledNavItem>
        );

        if (hasChild) {
            return renderContent;
        }

        if (externalLink) {
            return (
                <Link href={path} target="_blank" rel="noopener" color="inherit" underline="none">
                    {renderContent}
                </Link>
            );
        }

        return (
            <Link component={RouterLink} href={path} color="inherit" underline="none">
                {renderContent}
            </Link>
        );
    }
);

NavItem.displayName = "NavItem";

// ----------------------------------------------------------------------

const StyledNavItem = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== "active" && prop !== "subItem",
})<NavItemStateProps>(({ open, active, subItem, theme }) => {
    const opened = open && !active;

    return {
        // Root item
        ...(!subItem && {
            ...theme.typography.body2,
            padding: 0,
            height: "100%",
            fontWeight: theme.typography.fontWeightMedium,
            transition: theme.transitions.create(["all"], {
                duration: theme.transitions.duration.shorter,
            }),
            "&:hover": {
                opacity: 0.64,
                backgroundColor: "transparent",
            },
            ...(active && {
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightSemiBold,
            }),
            ...(opened && {
                opacity: 0.64,
            }),
        }),

        // Sub item
        ...(subItem && {
            ...theme.typography.body2,
            padding: 0,
            fontSize: 13,
            color: theme.palette.text.secondary,
            fontWeight: theme.typography.fontWeightMedium,
            transition: theme.transitions.create(["all"], {
                duration: theme.transitions.duration.shorter,
            }),
            "&:hover": {
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
            },
            ...(active && {
                color: theme.palette.text.primary,
                fontWeight: theme.typography.fontWeightSemiBold,
            }),
        }),
    };
});

// ----------------------------------------------------------------------

type NavItemDashboardProps = LinkProps & {
    path: string;
};

export function NavItemDashboard({ path, sx, ...other }: NavItemDashboardProps) {
    return (
        <Link component={RouterLink} href={path} sx={{ width: 1, height: 1 }} {...other}>
            <CardActionArea
                sx={{
                    height: 1,
                    minHeight: 320,
                    borderRadius: 1.5,
                    color: "text.disabled",
                    bgcolor: "background.neutral",
                    px: { md: 3, lg: 10 },
                    ...sx,
                }}
            >
                <m.div
                    whileTap="tap"
                    whileHover="hover"
                    variants={{
                        hover: { scale: 1.02 },
                        tap: { scale: 0.98 },
                    }}
                >
                    <Box
                        component="img"
                        alt="illustration_dashboard"
                        src="/assets/illustrations/illustration_dashboard.png"
                    />
                </m.div>
            </CardActionArea>
        </Link>
    );
}

import Collapse from "@mui/material/Collapse";
import { listItemButtonClasses } from "@mui/material/ListItemButton";
import { stackClasses } from "@mui/material/Stack";
import { useCallback, useState } from "react";

import { NavSectionVertical } from "@/components/nav-section";
import { useActiveLink } from "@/routes/hooks/use-active-link";

import { NavListProps } from "../types";
import { NavItem } from "./nav-item";

// ----------------------------------------------------------------------

export default function NavList({ data }: NavListProps) {
    const active = useActiveLink(data.path, !!data.children);

    const [openMenu, setOpenMenu] = useState(false);

    const handleToggleMenu = useCallback(() => {
        if (data.children) {
            setOpenMenu((prev) => !prev);
        }
    }, [data.children]);

    return (
        <>
            <NavItem
                open={openMenu}
                onClick={handleToggleMenu}
                //
                title={data.title}
                path={data.path}
                icon={data.icon}
                //
                hasChild={!!data.children}
                externalLink={data.path.includes("http")}
                //
                active={active}
            />

            {!!data.children && (
                <Collapse in={openMenu} unmountOnExit>
                    <NavSectionVertical
                        data={data.children}
                        slotProps={{
                            rootItem: {
                                minHeight: 36,
                            },
                        }}
                        sx={{
                            [`& .${stackClasses.root}`]: {
                                "&:last-of-type": {
                                    [`& .${listItemButtonClasses.root}`]: {
                                        height: 160,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        bgcolor: "background.neutral",
                                        backgroundRepeat: "no-repeat",
                                        backgroundImage:
                                            "url(/assets/illustrations/illustration_dashboard.png)",
                                        "& .label": {
                                            display: "none",
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </Collapse>
            )}
        </>
    );
}

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { m } from "framer-motion";

import { contacts } from "@/_mock";
import { varHover } from "@/components/animate";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import { fToNow } from "@/utils/format-time";

// ----------------------------------------------------------------------

export default function ContactsPopover() {
    const popover = usePopover();

    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                color={popover.open ? "inherit" : "default"}
                onClick={popover.onOpen}
                sx={{
                    ...(popover.open && {
                        bgcolor: (theme) => theme.palette.action.selected,
                    }),
                }}
            >
                <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
            </IconButton>

            <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 320 }}>
                <Typography variant="h6" sx={{ p: 1.5 }}>
                    Contacts <Typography component="span">({contacts.length})</Typography>
                </Typography>

                <Scrollbar sx={{ height: 320 }}>
                    {contacts.map((contact) => (
                        <MenuItem key={contact.id} sx={{ p: 1 }}>
                            <Badge
                                variant={contact.status as "alway" | "online" | "busy" | "offline"}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                sx={{ mr: 2 }}
                            >
                                <Avatar alt={contact.name} src={contact.avatarUrl} />
                            </Badge>

                            <ListItemText
                                primary={contact.name}
                                secondary={
                                    contact.status === "offline" ? fToNow(contact.lastActivity) : ""
                                }
                                primaryTypographyProps={{ typography: "subtitle2" }}
                                secondaryTypographyProps={{
                                    typography: "caption",
                                    color: "text.disabled",
                                }}
                            />
                        </MenuItem>
                    ))}
                </Scrollbar>
            </CustomPopover>
        </>
    );
}

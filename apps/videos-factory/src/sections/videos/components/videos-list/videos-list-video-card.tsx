import {
    alpha,
    Card,
    IconButton,
    Link,
    MenuItem,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

import CustomPopover, { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import Image from "@/components/image";
import Label from "@/components/label";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { useDeleteVideo } from "@/services/videosService/hooks/useDeleteVideo";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";
import { IVideo, VideoStatus } from "@/types/video";
import { formatSeconds, formatServerTimestamp } from "@/utils/format-time";

type Props = {
    video: IVideo;
};

export default function VideosListVideoCard({ video }: Props) {
    const theme = useTheme();
    const popover = usePopover();
    const router = useRouter();
    const deleteVideo = useDeleteVideo();
    const thumbnail = video.thumbnail || "https://placehold.co/135x240";

    const handleDeleteVideo = async () => {
        await deleteVideo(video.id);
        popover.onClose();
    };

    return (
        <>
            <Stack component={Card} direction="row">
                <Box
                    sx={{
                        width: 135,
                        height: 240,
                        position: "relative",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.lighter, 0.25),
                    }}
                >
                    {thumbnail ? (
                        <Image
                            alt={video.name}
                            src={video.thumbnail || "https://placehold.co/135x240"}
                            ratio="9/16"
                        />
                    ) : (
                        <Stack
                            justifyContent="center"
                            sx={{
                                width: 1,
                                height: 1,
                            }}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                sx={{
                                    color: theme.palette.primary.darker,
                                }}
                            >
                                Thumbnail not generated yet
                            </Typography>
                        </Stack>
                    )}
                </Box>
                <Stack
                    sx={{
                        width: 1,
                        p: theme.spacing(3, 3, 2, 3),
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                    >
                        <Box
                            component="span"
                            sx={{ typography: "caption", color: "text.disabled" }}
                        >
                            {formatServerTimestamp(video.updatedAt)}
                        </Box>
                        <Label variant="soft" color="default">
                            {video.status}
                        </Label>
                    </Stack>

                    <Stack spacing={1} flexGrow={1}>
                        <Link
                            color="inherit"
                            component={RouterLink}
                            href={paths.dashboard.videos.create}
                        >
                            <Typography variant="h5">{video.name}</Typography>
                        </Link>

                        <Stack direction="row" alignItems="center" sx={{ color: "text.disabled" }}>
                            {icon("stopwatch", { width: 18 })}
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: pxToRem(14),
                                    ml: 1,
                                }}
                            >
                                {video.duration !== undefined
                                    ? formatSeconds(video.duration)
                                    : "No duration yet"}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                        <IconButton
                            color={popover.open ? "inherit" : "default"}
                            onClick={popover.onOpen}
                        >
                            <Iconify icon="eva:more-horizontal-fill" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="bottom-center"
                sx={{ width: 140 }}
            >
                {/* <MenuItem
                    onClick={() => {
                        popover.onClose();
                        // router.push(paths.dashboard.post.details(title));
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem> */}

                {video.status === VideoStatus.Draft && (
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            router.push(paths.dashboard.videos.create);
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>
                )}

                <MenuItem onClick={handleDeleteVideo} sx={{ color: "error.main" }}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>
        </>
    );
}

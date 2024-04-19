import {
    alpha,
    Button,
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

import { useAuthContext } from "@/auth/hooks";
import { ConfirmDialog } from "@/components/custom-dialog";
import CustomPopover, { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import Image from "@/components/image";
import { useBoolean } from "@/hooks/use-boolean";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { useDeleteVideo } from "@/services/videosService/hooks/useDeleteVideo";
import { getVideoUrlById } from "@/services/videosService/videosService";
import { icon } from "@/theme/icons";
import { pxToRem } from "@/theme/typography";
import { IVideo, VideoStatus } from "@/types/video";
import { downloadURI } from "@/utils/dowloadURI";
import { fDate, formatSeconds } from "@/utils/format-time";

import VideosStatus from "../common/videos-status";

type Props = {
    video: IVideo;
};

export default function VideosListVideoCard({ video }: Props) {
    const theme = useTheme();
    const popover = usePopover();
    const router = useRouter();
    const { user } = useAuthContext();
    const deleteVideo = useDeleteVideo();

    const isConfirmDeleteOpened = useBoolean();
    const thumbnail = video.thumbnailKey || "https://placehold.co/135x240";

    const handleDeleteVideo = async () => {
        await deleteVideo(video.id);
        popover.onClose();
    };

    const clickDownload = async () => {
        const videoUrl = await getVideoUrlById(user?.accessToken, video.id);

        downloadURI(videoUrl);
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
                            src={video.thumbnailUrl || "https://placehold.co/135x240"}
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
                            {fDate(video.updatedAt)}
                        </Box>
                        <VideosStatus status={video.status} />
                    </Stack>

                    <Stack spacing={1} flexGrow={1}>
                        <Link
                            color="inherit"
                            component={RouterLink}
                            href={
                                video.status === VideoStatus.Draft
                                    ? paths.dashboard.videos.create
                                    : paths.dashboard.videos.byId(video.id)
                            }
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
                                    : "Not available"}
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
                <MenuItem onClick={clickDownload}>
                    <Iconify icon="solar:cloud-download-bold-duotone" />
                    Download
                </MenuItem>
                {video.status === VideoStatus.Draft ? (
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            router.push(paths.dashboard.videos.create);
                        }}
                    >
                        <Iconify icon="solar:pen-bold-duotone" />
                        Edit
                    </MenuItem>
                ) : (
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            router.push(paths.dashboard.videos.byId(video.id));
                        }}
                    >
                        <Iconify icon="solar:eye-bold-duotone" />
                        View
                    </MenuItem>
                )}

                <MenuItem onClick={isConfirmDeleteOpened.onTrue} sx={{ color: "error.main" }}>
                    <Iconify icon="solar:trash-bin-trash-bold-duotone" />
                    Delete
                </MenuItem>
            </CustomPopover>
            <ConfirmDialog
                open={isConfirmDeleteOpened.value}
                onClose={isConfirmDeleteOpened.onFalse}
                title="Read carefully"
                content={
                    <>
                        Deleting a video <strong> does not restore your used videos</strong> and
                        will be lost forever. <br />
                        Are you sure want to delete it?
                    </>
                }
                action={
                    <Button variant="contained" color="error" onClick={handleDeleteVideo}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}

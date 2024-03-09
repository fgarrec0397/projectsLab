import { useMemo } from "react";

import Label, { LabelColor, LabelSize } from "@/components/label";
import { VideoStatus } from "@/types/video";

type Props = {
    status?: VideoStatus;
    size?: LabelSize;
};

export default function VideosStatus({ status = VideoStatus.Draft, size }: Props) {
    const statusColorMapping: Record<VideoStatus, LabelColor> = useMemo(
        () => ({
            draft: "default",
            generatingScript: "warning",
            scriptGenerated: "warning",
            generatingTemplate: "warning",
            templateGenerated: "warning",
            rendering: "warning",
            rendered: "success",
            publishing: "warning",
            published: "primary",
        }),
        []
    );

    const color = useMemo<LabelColor>(
        () => statusColorMapping[status],
        [status, statusColorMapping]
    );

    return (
        <Label variant="soft" color={color} size={size}>
            {status}
        </Label>
    );
}

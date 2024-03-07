import { Card, CardContent, CardHeader } from "@mui/material";
import { ReactNode } from "react";

import FilesTable from "@/sections/videos/components/videos-create/files-table";
import { pxToRem } from "@/theme/typography";
import { IFile } from "@/types/file";

import EmptyContent from "../empty-content";
import { TableProps } from "../table";

// ----------------------------------------------------------------------

type Props = {
    title: ReactNode;
    action?: ReactNode;
    files: IFile[];
    table?: TableProps;
    maxHeight?: number;
    onRemoveFile?: (fileId: string) => void;
};

export default function FilesTableCard({
    title,
    action,
    files,
    table,
    maxHeight = 505,
    onRemoveFile,
}: Props) {
    return (
        <Card sx={{ height: "100%", maxHeight: pxToRem(maxHeight) }}>
            <CardHeader title={title} sx={{ mb: 2 }} action={action} />
            <CardContent>
                {files.length ? (
                    <FilesTable
                        table={table}
                        files={files}
                        onRemoveFile={onRemoveFile}
                        scrollHeightPx={410}
                    />
                ) : (
                    <EmptyContent
                        filled
                        title="No Data"
                        sx={{
                            py: 10,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}

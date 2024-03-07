import { Table, TableBody } from "@mui/material";

import Scrollbar from "@/components/scrollbar";
import { TableProps } from "@/components/table";
import { pxToRem } from "@/theme/typography";
import { IFile } from "@/types/file";

import FilesTableRow from "./files-table-row";

type Props = {
    table?: TableProps;
    files: IFile[];
    scrollHeightPx?: number;
    onRemoveFile?: (fileId: string) => void;
};

export default function FilesTable({ table, files, scrollHeightPx, onRemoveFile }: Props) {
    return (
        <Scrollbar sx={{ height: scrollHeightPx ? pxToRem(scrollHeightPx) : undefined }}>
            <Table size="small">
                <TableBody>
                    {files.map((row) => (
                        <FilesTableRow
                            key={row.id}
                            row={row}
                            selected={table?.selected.includes(row.id)}
                            onSelectRow={table?.onSelectRow}
                            onRemoveFile={onRemoveFile}
                        />
                    ))}
                </TableBody>
            </Table>
        </Scrollbar>
    );
}

import { Table, TableBody, TableContainer } from "@mui/material";

import { TableProps } from "@/components/table";
import { IFile } from "@/types/file";

import FilesTableRow from "./files-table-row";

type Props = {
    table: TableProps;
    files: IFile[];
    onRemoveFile: (fileId: string) => void;
};

export default function FilesTable({ table, files, onRemoveFile }: Props) {
    const { onSelectRow, selected } = table;

    return (
        <TableContainer>
            <Table size="small">
                <TableBody>
                    {files.map((row) => (
                        <FilesTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={onSelectRow}
                            onRemoveFile={onRemoveFile}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

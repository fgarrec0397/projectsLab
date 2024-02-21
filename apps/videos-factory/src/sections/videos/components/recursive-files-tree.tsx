import { Checkbox } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view";

import { pxToRem } from "@/theme/typography";
import { IFile } from "@/types/file";

import { RecuriveFilesTree } from "../utils/mapFilesToRecursiveFolder";

type Props = { files: RecuriveFilesTree; selectedIds: string[] };

export default function RecursiveFilesTree({ files, selectedIds }: Props) {
    return (
        <>
            {Object.keys(files).map((fileKey) => {
                const file = files[fileKey] as IFile;
                const isFileSelected = selectedIds.indexOf(file.id) !== -1;

                if (file.id) {
                    return (
                        <TreeItem
                            key={file.id}
                            nodeId={file.id}
                            icon={null}
                            endIcon={null}
                            label={
                                <>
                                    <Checkbox
                                        checked={isFileSelected}
                                        sx={{ padding: pxToRem(3) }}
                                    />
                                    {file.name}
                                </>
                            }
                            sx={{
                                ".MuiTreeItem-content": {
                                    padding: 0,
                                },
                                ".MuiTreeItem-label": {
                                    paddingLeft: 0,
                                },
                            }}
                        />
                    );
                }

                return (
                    <TreeItem key={fileKey} nodeId={fileKey} label={fileKey}>
                        <RecursiveFilesTree
                            files={files[fileKey] as RecuriveFilesTree}
                            selectedIds={selectedIds}
                        />
                    </TreeItem>
                );
            })}
        </>
    );
}

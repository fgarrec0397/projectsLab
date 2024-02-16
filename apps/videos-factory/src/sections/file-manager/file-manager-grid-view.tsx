import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { useCallback, useRef, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import Iconify from "@/components/iconify";
import { TableProps } from "@/components/table";
import { useBoolean } from "@/hooks/use-boolean";
import { createFolder } from "@/services/filesService/filesService";
import { IFile, IFolderManager } from "@/types/file";

import FileManagerActionSelected from "./file-manager-action-selected";
import FileManagerFileItem from "./file-manager-file-item";
import FileManagerFolderItem from "./file-manager-folder-item";
import FileManagerNewFolderDialog from "./file-manager-new-folder-dialog";
import FileManagerPanel from "./file-manager-panel";
import { useFolderNavigation } from "./hooks/use-folder-navigation";

// ----------------------------------------------------------------------

type Props = {
    table: TableProps;
    dataFiltered: IFile[];
    onOpenConfirm: VoidFunction;
    onDeleteItem: (id: string) => void;
};

export default function FileManagerGridView({
    table,
    dataFiltered,
    onDeleteItem,
    onOpenConfirm,
}: Props) {
    const { currentPath } = useFolderNavigation();

    const { user } = useAuthContext();

    const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

    const containerRef = useRef(null);

    const [folderName, setFolderName] = useState("");

    const newFolder = useBoolean();

    const upload = useBoolean();

    const files = useBoolean();

    const folders = useBoolean();

    const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(event.target.value);
    }, []);

    const onCreateFolder = async () => {
        newFolder.onFalse();
        await createFolder(user?.accessToken, folderName, currentPath);
        setFolderName("");
    };

    return (
        <>
            <Box ref={containerRef}>
                <FileManagerPanel
                    title="Folders"
                    subTitle={`${
                        dataFiltered.filter((item) => item.type === "folder").length
                    } folders`}
                    onOpen={newFolder.onTrue}
                    collapse={folders.value}
                    onCollapse={folders.onToggle}
                />

                <Collapse in={!folders.value} unmountOnExit>
                    <Box
                        gap={3}
                        display="grid"
                        gridTemplateColumns={{
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(4, 1fr)",
                        }}
                    >
                        {dataFiltered
                            .filter((i) => i.type === "folder")
                            .map((folder) => (
                                <FileManagerFolderItem
                                    key={folder.id}
                                    folder={folder as IFolderManager}
                                    selected={selected.includes(folder.id)}
                                    onSelect={(event) =>
                                        onSelectItem(
                                            event as React.MouseEvent<HTMLElement>,
                                            folder.id
                                        )
                                    }
                                    onDelete={() => onDeleteItem(folder.id)}
                                    sx={{ maxWidth: "auto" }}
                                />
                            ))}
                    </Box>
                </Collapse>

                <Divider sx={{ my: 5, borderStyle: "dashed" }} />

                <FileManagerPanel
                    title="Files"
                    subTitle={`${
                        dataFiltered.filter((item) => item.type !== "folder").length
                    } files`}
                    onOpen={upload.onTrue}
                    collapse={files.value}
                    onCollapse={files.onToggle}
                />

                <Collapse in={!files.value} unmountOnExit>
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(4, 1fr)",
                        }}
                        gap={3}
                    >
                        {dataFiltered
                            .filter((i) => i.type !== "folder")
                            .map((file) => (
                                <FileManagerFileItem
                                    key={file.id}
                                    file={file}
                                    selected={selected.includes(file.id)}
                                    onSelect={(event) =>
                                        onSelectItem(
                                            event as React.MouseEvent<HTMLElement>,
                                            file.id
                                        )
                                    }
                                    onDelete={() => onDeleteItem(file.id)}
                                    sx={{ maxWidth: "auto" }}
                                />
                            ))}
                    </Box>
                </Collapse>

                {!!selected?.length && (
                    <FileManagerActionSelected
                        numSelected={selected.length}
                        rowCount={dataFiltered.length}
                        selected={selected}
                        onSelectAllItems={(checked) =>
                            onSelectAllItems(
                                checked,
                                dataFiltered.map((row) => row.id)
                            )
                        }
                        action={
                            <>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="contained"
                                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                    onClick={onOpenConfirm}
                                    sx={{ mr: 1 }}
                                >
                                    Delete
                                </Button>
                            </>
                        }
                    />
                )}
            </Box>

            <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

            <FileManagerNewFolderDialog
                open={newFolder.value}
                onClose={newFolder.onFalse}
                title="New Folder"
                onCreate={onCreateFolder}
                folderName={folderName}
                onChangeFolderName={handleChangeFolderName}
            />
        </>
    );
}

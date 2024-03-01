import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { TreeView } from "@mui/x-tree-view";
import { SyntheticEvent, useMemo, useState } from "react";

import { PrimaryButton } from "@/components/button";
import { TertiaryButton } from "@/components/button/tertiary-button";
import { icon } from "@/theme/icons";
import { IFile } from "@/types/file";

import { mapFilesToRecursiveFolder } from "../../utils/mapFilesToRecursiveFolder";
import RecursiveFilesTree from "./recursive-files-tree";

type Props = {
    isFilesModalOpen: boolean;
    files: IFile[];
    onCloseFilesModal: () => void;
    onSelectFiles: (files: IFile[]) => void;
};

export default function FilesSelectorModal({
    isFilesModalOpen,
    files,
    onCloseFilesModal,
    onSelectFiles,
}: Props) {
    const [selected, setSelected] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);

    const mappedFiles = useMemo(() => mapFilesToRecursiveFolder(files), [files]);

    const handleSelect = (event: SyntheticEvent, nodeIds: string[]) => {
        const newSelected = [...selected];

        nodeIds.forEach((nodeId) => {
            const selectedIndex = selected.indexOf(nodeId);

            if (selectedIndex === -1) {
                newSelected.push(nodeId);
            } else if (!(event as React.MouseEvent).shiftKey) {
                newSelected.splice(selectedIndex, 1);
            }
        });

        setSelected(newSelected);
    };

    const handleExpand = (event: SyntheticEvent<Element, Event>, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelectFilesClick = () => {
        const selectedFiles = files.filter((x) => selected.findIndex((s) => s === x.id) !== -1);

        onSelectFiles(selectedFiles);
        setSelected([]);
    };

    return (
        <Dialog open={isFilesModalOpen} fullWidth onClose={onCloseFilesModal}>
            <DialogTitle>Select the files</DialogTitle>
            <DialogContent>
                <TreeView
                    selected={selected}
                    expanded={expanded}
                    aria-label="file system navigator"
                    onNodeSelect={handleSelect}
                    onNodeToggle={handleExpand}
                    defaultExpandIcon={icon("folder-2")}
                    defaultCollapseIcon={icon("folder-open")}
                    defaultEndIcon={null}
                    multiSelect
                >
                    <RecursiveFilesTree files={mappedFiles} selectedIds={selected} />
                </TreeView>
            </DialogContent>
            <DialogActions>
                <TertiaryButton onClick={onCloseFilesModal}>Cancel</TertiaryButton>
                <PrimaryButton onClick={handleSelectFilesClick}>Select these files</PrimaryButton>
            </DialogActions>
        </Dialog>
    );
}

import { TreeItem, TreeView } from "@mui/x-tree-view";
import { SyntheticEvent, useMemo } from "react";

import { useGetFiles } from "@/services/filesService/hooks/useGetFiles";

import { mapFilesToRecursiveFolder } from "../utils/mapFilesToRecursiveFolder";

export default function FilesSelector() {
    const { files } = useGetFiles();

    const mappedFiles = useMemo(() => mapFilesToRecursiveFolder(files), [files]);

    console.log(files, "files");
    console.log(mappedFiles, "mappedFiles");

    const handleSelect = (event: SyntheticEvent<Element, Event>, nodeIds: string[]) => {
        console.log(event, nodeIds, "nodeIds");
    };

    return (
        <TreeView aria-label="file system navigator" onNodeSelect={handleSelect} multiSelect>
            <TreeItem nodeId="1" label="Applications">
                <TreeItem nodeId="2" label="Calendar" />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                    <TreeItem nodeId="8" label="index.js" />
                </TreeItem>
            </TreeItem>
        </TreeView>
    );
}

import { TreeItem, TreeView } from "@mui/x-tree-view";
import { SyntheticEvent, useMemo } from "react";

import { useGetFiles } from "@/services/filesService/hooks/useGetFiles";

import { mapFilesToRecursiveFolder } from "../utils/mapFilesToRecursiveFolder";
import RecursiveFilesTree from "./recursive-files-tree";

export default function FilesSelector() {
    const { allFiles } = useGetFiles();

    const mappedFiles = useMemo(() => mapFilesToRecursiveFolder(allFiles), [allFiles]);

    // console.log(allFiles, "allFiles");
    console.log(mappedFiles, "mappedFiles");

    const handleSelect = (event: SyntheticEvent<Element, Event>, nodeIds: string[]) => {
        console.log(event, nodeIds, "nodeIds");
    };

    return (
        <TreeView aria-label="file system navigator" onNodeSelect={handleSelect} multiSelect>
            <RecursiveFilesTree files={mappedFiles} />
        </TreeView>
    );
}

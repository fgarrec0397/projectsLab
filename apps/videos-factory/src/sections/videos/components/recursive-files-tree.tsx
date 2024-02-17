import { TreeItem } from "@mui/x-tree-view";

import { IFile } from "@/types/file";

import { RecuriveFilesTree } from "../utils/mapFilesToRecursiveFolder";

type Props = { files: RecuriveFilesTree };

export default function RecursiveFilesTree({ files }: Props) {
    return (
        <>
            {Object.keys(files).map((fileKey) => {
                const file = files[fileKey] as IFile;

                if (file.id) {
                    return <TreeItem key={file.id} nodeId={file.id} label={file.name} />;
                }

                return (
                    <TreeItem key={file.id} nodeId={file.id} label={file.name}>
                        <RecursiveFilesTree files={files[fileKey] as RecuriveFilesTree} />
                    </TreeItem>
                );
            })}
        </>
    );
}

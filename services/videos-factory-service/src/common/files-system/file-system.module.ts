import { Global, Module } from "@nestjs/common";

import { FileSystemService } from "./services/file-system.service";
import { TempFoldersService } from "./services/temp-folders.service";

@Global()
@Module({
    providers: [FileSystemService, TempFoldersService],
    exports: [FileSystemService, TempFoldersService],
})
export class FileSystemModule {}

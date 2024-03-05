import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FilesValidationPipe implements PipeTransform {
    async transform(files: Express.Multer.File[]) {
        const maxMgb = 20;
        const MAX_FILE_SIZE = 1024 * 1024 * maxMgb;
        const ALLOWED_FILE_TYPES = ["video/mp4", "image/jpeg", "image/png", "audio/mpeg"];
        const validFiles: Express.Multer.File[] = [];

        for (const file of files) {
            if (file.size < MAX_FILE_SIZE && ALLOWED_FILE_TYPES.includes(file.mimetype)) {
                validFiles.push(file);
            }
        }

        return validFiles;
    }
}

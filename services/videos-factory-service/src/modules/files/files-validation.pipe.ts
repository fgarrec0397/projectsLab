import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FilesValidationPipe implements PipeTransform {
    async transform(files: Express.Multer.File[]) {
        const maxMgb = 20;
        const MAX_FILE_SIZE = 1024 * 1024 * maxMgb;
        const ALLOWED_FILE_TYPES = ["video/mp4", "image/jpeg", "image/png", "audio/mpeg"];

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                throw new HttpException(
                    `File size is too large. The files should be under ${maxMgb}mb`,
                    HttpStatus.BAD_REQUEST
                );
            }

            if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
                throw new HttpException(
                    `Invalid file type. Only ${ALLOWED_FILE_TYPES.join(", ")} are valid types`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        return files;
    }
}

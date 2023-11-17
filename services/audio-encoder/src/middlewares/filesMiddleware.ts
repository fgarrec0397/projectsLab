import multer, { diskStorage } from "multer";
import path from "path";

const storage = diskStorage({
    destination: (req, file, cb) => {
        const filePath = req.body.currentPath || "";

        const storagePath = path.resolve("../admin", "public", filePath);

        cb(null, storagePath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export default (inputName: string) => {
    return upload.array(inputName);
};

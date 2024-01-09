import fs from "fs";

export const convertMp3ToBuffer = (filePath: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            console.log("convertMp3ToBuffer finished");

            resolve(data);
        });
    });
};

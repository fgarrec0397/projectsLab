import { readFileSync } from "fs";

export const loadJson = <TValue>(path: string) => {
    try {
        const rawData = readFileSync(path, "utf8");

        const jsonObject = JSON.parse(rawData);

        return jsonObject as TValue;
    } catch (error) {
        console.error("Error reading the file:", error);
        return null;
    }
};

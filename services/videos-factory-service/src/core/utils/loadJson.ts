import { readFileSync } from "fs";

export const loadJson = <TValue>(path: string) => {
    try {
        // Synchronously read the file
        const rawData = readFileSync(path, "utf8");

        // Parse the JSON content to an object
        const jsonObject = JSON.parse(rawData);

        return jsonObject as TValue;
    } catch (error) {
        console.error("Error reading the file:", error);
    }
};

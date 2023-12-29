import { TimedText } from "../mappers/mapSubtitles";
import { nanosToSeconds } from "../nanosToSeconds";

export const buildSubtitlesFilter = (subtitles?: TimedText[]) => {
    const filters: Array<string> = [];

    if (!subtitles) {
        return filters;
    }

    return subtitles
        .map((subtitle, index) => {
            const startTime = nanosToSeconds(subtitle.startTime!.nanos!);
            const endTime = nanosToSeconds(subtitle.endTime!.nanos!);

            const inputLabel = index === 0 ? "[0:v]" : `[tmp${index - 1}]`;
            const subtitleInput = `[${index + 1}:v]`;
            const outputLabel = index === subtitles.length - 1 ? undefined : `[tmp${index}]`;

            return `${inputLabel}${subtitleInput}overlay=x=10:y=10:enable='between(t,${startTime},${endTime})'${
                outputLabel ? `${outputLabel}` : ""
            }`;
        })
        .filter((filter) => filter !== undefined);
};

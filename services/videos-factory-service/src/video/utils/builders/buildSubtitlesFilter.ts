import { FilterSpecification } from "fluent-ffmpeg";

import { Subtitle } from "../mappers/mapSubtitles";
import { nanosToSeconds } from "../nanosToSeconds";

const isFalse = <TValue>(value: TValue) => {
    return value === false || value === undefined || value === null;
};

export const buildSubtitlesFilter = (subtitles?: Subtitle[]) => {
    const filters: FilterSpecification[] = [];

    if (!subtitles) {
        return filters;
    }

    return subtitles
        .map((subtitle, index) => {
            console.log(index, "index");

            if (
                isFalse(subtitle.startTime?.nanos) ||
                isFalse(subtitle.endTime?.nanos) ||
                !subtitle.word
            ) {
                return;
            }

            const startTime = nanosToSeconds(subtitle.startTime?.nanos!);
            const endTime = nanosToSeconds(subtitle.endTime?.nanos!);
            const inputLabel = index === 0 ? "[0:v]" : `[tmp${index - 1}]`;
            const outputLabel = index === subtitles.length - 1 ? "[out]" : `[tmp${index}]`;

            return {
                filter: "overlay",
                options: { x: 10, y: 10 * index }, // Adjust Y position for each subtitle
                inputs: `${inputLabel}[text${index}]`,
                outputs: outputLabel,
                enable: `between(t,${startTime},${endTime})`,
            };
        })
        .filter((filter) => filter !== undefined) as FilterSpecification[];
};

import { TimedText } from "../video-renderer.types";

type AssFileEntry = {
    word: string | null | undefined;
    start: string | undefined;
    end: string | undefined;
};

export class AssFileBuilder {
    header: string;

    entries: AssFileEntry[] = [];

    constructor() {
        this.header = this.addHeader();
    }

    addEntry(timedText: TimedText) {
        const entry = this.timedTextToAssEntry(timedText);
        this.entries.push(entry);
    }

    build() {
        const body = this.entries
            .map(
                (entry) =>
                    `Dialogue: 0,${entry.start},${
                        entry.end
                    },Default,,0000,0000,0000,,{\\fad(100,0)}${entry.word.toUpperCase()}`
            )
            .join("\n");

        return `${this.header}\n${body}`;
    }

    private addHeader() {
        return `[Script Info]
        Title: Dynamically Generated Subtitles
        ScriptType: v4.00+
        WrapStyle: 0
        ScaledBorderAndShadow: yes
        YCbCr Matrix: None
        
        [V4+ Styles]
        Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
        Style: Default, Montserrat Black, 16, &H00FFFFFF, &H000000FF, &H00000000, &H64000000, -1, 0, 0, 0, 100, 100, 0, 0, 1, 3, 2, 5, 10, 10, 10, 1

        [Events]
        Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
        `;
    }

    private timedTextToAssEntry(timedText: TimedText): AssFileEntry {
        return {
            word: timedText.word,
            start: this.secondsToAssTime(timedText.start),
            end: this.secondsToAssTime(timedText.end),
        };
    }

    private secondsToAssTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const sec = Math.floor(seconds % 60);
        const centiseconds = Math.round((seconds % 1) * 100);

        return `${hours.toString().padStart(1, "0")}:${minutes.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    }
}

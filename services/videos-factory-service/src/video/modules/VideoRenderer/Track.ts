export class Track {
    private static currentTrackNumber = 0;

    private static tracks: Map<number, Track> = new Map();

    public readonly trackNumber: number;

    private constructor(trackNumber: number) {
        this.trackNumber = trackNumber;
    }

    public static assignElementToTrack() {}

    public static createTrack(): Track {
        this.currentTrackNumber += 1;
        const newTrack = new Track(this.currentTrackNumber);
        this.tracks.set(this.currentTrackNumber, newTrack);
        return newTrack;
    }

    public static getTrackByNumber(trackNumber: number): Track | undefined {
        return this.tracks.get(trackNumber);
    }
}

import path from "path";

export const getAssetsPath = (assetPath: string) => {
    return path.resolve("./assets/poc", assetPath).replace(/\\/g, "\\\\");
};

// -t 10 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/video1.mp4 -t 15 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/video2.mp4 -t 10 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/video3.mp4 -t 10 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/video4.mp4 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/background-music-Blade-Runner2049.mp3 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/speech.mp3 -i C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/tmp/output/text-462b9e65-cc99-4606-b59c-cef744aea3fc.png -y -filter_complex [0:v][0:a][1:v][1:a][2:v][2:a][3:v][3:a]concat=n=4:v=1:a=1[v][a];[a][4:a][5:a]amix=inputs=3[a_out];[v][6:v]overlay:x=0:y=0[v_out] -map [v_out] -map [a_out] -vcodec libx264 -r 60 -pix_fmt yuv420p C:/Users/fgarr/Documents/lab/projectsLab/services/videos-factory-service/assets/poc/out/refactor-video.mp4

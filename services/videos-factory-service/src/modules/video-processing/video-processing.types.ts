export enum VideoProcessingStepDataStatus {
    "GeneratingScript" = "generatingScript",
    "ScriptGenerated" = "scriptGenerated",
    "GeneratingTemplate" = "generatingTemplate",
    "TemplateGenerated" = "templateGenerated",
    "Rendering" = "rendering",
    "Rendered" = "rendered",
}

export type VideoProcessingStepData = {
    status: VideoProcessingStepDataStatus;
    data?: any;
};

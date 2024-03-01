export enum VideoProcessingStepDataStatus {
    "Draft" = "draft",
    "GeneratingScript" = "generatingScript",
    "ScriptGenerated" = "scriptGenerated",
    "GeneratingTemplate" = "generatingTemplate",
    "TemplateGenerated" = "templateGenerated",
    "Rendering" = "rendering",
    "Rendered" = "rendered",
    "Publishing" = "publishing",
    "Published" = "published",
}

export type VideoProcessingStepData = {
    status: VideoProcessingStepDataStatus;
    data?: any;
};

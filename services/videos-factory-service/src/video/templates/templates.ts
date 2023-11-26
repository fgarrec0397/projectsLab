import { Dictionary } from "@projectslab/helpers";
import { CanvasRenderingContext2D } from "canvas";

import { TemplateScene } from "../services/templateService";
import { tutorialTemplate } from "./tutorialTemplate/tutorialTemplate";

type TemplatesDictionary = Dictionary<(context: CanvasRenderingContext2D) => TemplateScene[]>;

export const templates: TemplatesDictionary = {
    tutorialTemplate,
};

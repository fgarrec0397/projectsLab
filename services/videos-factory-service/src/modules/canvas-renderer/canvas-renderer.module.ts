import { Module } from "@nestjs/common";

import { CanvasRendererService } from "./canvas-renderer.service";

@Module({
    providers: [CanvasRendererService],
})
export class CanvasRendererModule {}

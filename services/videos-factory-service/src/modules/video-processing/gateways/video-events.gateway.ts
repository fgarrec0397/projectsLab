import { BaseWebSocketGateway } from "src/common/websocket/base-websocket.gateway";

import { VideoProcessingStepData } from "../video-processing.types";

export class VideoEventsGateway extends BaseWebSocketGateway {
    notifyVideoProcessStep(data: VideoProcessingStepData) {
        this.broadcast("videoProcessingSteps", data);
    }
}

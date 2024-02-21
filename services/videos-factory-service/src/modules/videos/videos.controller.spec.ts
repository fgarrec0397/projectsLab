import { Test, TestingModule } from "@nestjs/testing";

import { VideoController } from "./videos.controller";

describe("VideoController", () => {
    let controller: VideoController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VideoController],
        }).compile();

        controller = module.get<VideoController>(VideoController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});

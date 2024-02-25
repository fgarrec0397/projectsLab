import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

import { IVideo } from "../videosTypes";

@Injectable()
export class VideoDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const videoData = request.body as IVideo;

        request.videoData = videoData;
        console.log(request.videoData, "request.videoData in VideoDataInterceptor");

        return next.handle();
    }
}

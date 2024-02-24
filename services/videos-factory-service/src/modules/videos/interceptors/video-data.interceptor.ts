import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

import { IVideo } from "../videosTypes";

@Injectable()
export class VideoDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const videoData = request.body.video as IVideo;

        request.videoData = videoData;

        return next.handle();
    }
}

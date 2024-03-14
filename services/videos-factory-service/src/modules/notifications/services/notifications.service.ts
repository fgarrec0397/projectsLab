import { Injectable } from "@nestjs/common";
import { CacheService } from "src/common/cache/cache.service";
import { BaseWebSocketGateway } from "src/common/websocket/base-websocket.gateway";

export type NotificationOptions<TData> = {
    event: string;
    data: TData;
    cacheKey?: string | string[];
};

@Injectable()
export class NotificationsService {
    constructor(
        private readonly cacheService: CacheService,
        private readonly eventsGateway: BaseWebSocketGateway
    ) {}

    async notifyClient<TData>(userId: string, options: NotificationOptions<TData>) {
        const { event, data, cacheKey } = options;

        if (Array.isArray(cacheKey)) {
            cacheKey.forEach((key) => {
                this.cacheService.invalidate(key, data);
            });
        } else {
            this.cacheService.invalidate(cacheKey, data);
        }

        this.eventsGateway.broadcastRoom(event, userId, data);
    }
}

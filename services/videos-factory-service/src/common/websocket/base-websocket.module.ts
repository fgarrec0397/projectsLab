import { Global, Module } from "@nestjs/common";

import { BaseWebSocketGateway } from "./base-websocket.gateway";

@Global()
@Module({
    providers: [BaseWebSocketGateway],
    exports: [BaseWebSocketGateway],
})
export class BaseWebSocketModule {}

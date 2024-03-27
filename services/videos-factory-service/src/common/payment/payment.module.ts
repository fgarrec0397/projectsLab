import { Global, Module } from "@nestjs/common";

import { PaymentService } from "./services/payment.service";

@Global()
@Module({
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}

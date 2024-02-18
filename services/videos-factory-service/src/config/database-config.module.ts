import { Global, Inject, Module } from "@nestjs/common";
import { Database, DATABASE_TOKEN } from "src/common/database/database";
import { Firebase } from "src/common/database/strategies/firebase.strategy";

const provider = {
    provide: DATABASE_TOKEN,
    useClass: Firebase,
};

export type DatabaseConfig = Firebase;

export const InjectDatabase = () => Inject(DATABASE_TOKEN);

@Global()
@Module({
    providers: [provider, Database],
    exports: [provider, Database],
})
export class DatabaseConfigModule {}

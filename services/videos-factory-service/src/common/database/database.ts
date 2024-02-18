import { Inject, Injectable } from "@nestjs/common";

export type DatabaseTypes = {
    get: unknown;
    set: unknown;
};

export interface DatabaseStrategy<T extends DatabaseTypes> {
    init(): void;
    get(collectionPath: string, documentId: string): T["get"];
    set<TData>(collectionPath: string, documentId: string, data: TData): T["set"];
}

export const DATABASE_TOKEN = "DatabaseToken";

@Injectable()
export class Database<T extends DatabaseTypes> {
    constructor(@Inject(DATABASE_TOKEN) private readonly databaseStrategy: DatabaseStrategy<T>) {
        this.init();
    }

    init() {
        this.databaseStrategy.init();
    }

    get(collectionPath: string, documentId: string) {
        return this.databaseStrategy.get(collectionPath, documentId);
    }

    set<TData>(collectionPath: string, documentId: string, data: TData) {
        return this.databaseStrategy.set(collectionPath, documentId, data);
    }
}

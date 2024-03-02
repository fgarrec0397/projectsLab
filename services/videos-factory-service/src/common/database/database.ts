import { Inject, Injectable } from "@nestjs/common";

export type DatabaseTypes = {
    getDB: unknown;
    create: unknown;
    createOrUpdate: unknown;
    findAll: unknown;
    findOne: unknown;
    update: unknown;
    delete: unknown;
    findWithQuery: unknown;
    findWithQueryOptions: any;
};

export interface DatabaseStrategy<T extends DatabaseTypes> {
    init(): void;
    getDB(): T["getDB"];
    create<TData>(collection: string, data: TData): T["create"];
    createOrUpdate<TData extends { id: string }>(
        collection: string,
        data: TData
    ): T["createOrUpdate"];
    findAll(collectionPath: string): T["findAll"];
    findOne(collectionPath: string, id: string): T["findOne"];
    update<
        TData extends {
            [x: string]: any;
        },
    >(
        collectionPath: string,
        id: string,
        data: TData
    ): T["update"];
    delete(collection: string, id: string): T["delete"];
    findWithQuery(collection: string, options: T["findWithQueryOptions"]): T["findWithQuery"];
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

    getDB() {
        return this.databaseStrategy.getDB();
    }

    async create<TData>(collection: string, data: TData) {
        return this.databaseStrategy.create(collection, data);
    }

    async createOrUpdate<TData extends { id: string }>(collection: string, data: TData) {
        return this.databaseStrategy.create(collection, data);
    }

    async findAll(collection: string) {
        return this.databaseStrategy.findAll(collection);
    }

    async findOne(collection: string, id: string) {
        return this.databaseStrategy.findOne(collection, id);
    }

    async update<
        TData extends {
            [x: string]: any;
        },
    >(collection: string, id: string, data: TData) {
        return this.databaseStrategy.update(collection, id, data);
    }

    async delete(collection: string, id: string) {
        return this.databaseStrategy.delete(collection, id);
    }

    async findWithQuery<TData>(collection: string, options: T["findWithQueryOptions"]) {
        return this.databaseStrategy.findWithQuery(collection, options) as TData[];
    }
}

import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Query, WhereFilterOp } from "firebase-admin/firestore";

import { DatabaseStrategy } from "../database";

type FirebaseTypes = {
    getDB: admin.firestore.Firestore;
    get: Promise<admin.firestore.DocumentData>;
    set: Promise<admin.firestore.WriteResult>;
};

@Injectable()
// export class FirebaseDatabase implements DatabaseStrategy<FirebaseTypes> { // TODO - bring changes to the database core class
export class FirebaseDatabase {
    private defaultApp: admin.app.App;

    init() {
        const serviceAccount = require("../../../../credentials/firebase-serviceAccountKey.json");

        this.defaultApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    getDB() {
        return this.defaultApp.firestore();
    }

    async create<TData>(collection: string, data: TData) {
        const sanitizedData = this.removeUndefinedProperties(data);
        return this.getDB().collection(collection).add(sanitizedData);
    }

    async findAll(collection: string) {
        return this.getDB().collection(collection).get();
    }

    async findOne(collection: string, id: string) {
        return this.getDB().collection(collection).doc(id).get();
    }

    async update<
        TData extends {
            [x: string]: any;
        },
    >(collection: string, id: string, data: TData) {
        return this.getDB().collection(collection).doc(id).update(data);
    }

    async delete(collection: string, id: string) {
        return this.getDB().collection(collection).doc(id).delete();
    }

    async findWithQuery(
        collection: string,
        conditions: { field: string; operator: WhereFilterOp; value: any }[],
        orderByField?: string,
        orderByDirection?: "asc" | "desc",
        limitNumber?: number
    ) {
        let query: Query = this.getDB().collection(collection);

        conditions.forEach((condition) => {
            query = query.where(condition.field, condition.operator, condition.value);
        });

        if (orderByField) {
            query = query.orderBy(orderByField, orderByDirection);
        }

        if (limitNumber) {
            query = query.limit(limitNumber);
        }

        const snapshot = await query.get();

        return snapshot.docs.map((doc) => doc.data());
    }

    private removeUndefinedProperties(obj: Record<string, any>): Record<string, any> {
        return Object.entries(obj)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }
}

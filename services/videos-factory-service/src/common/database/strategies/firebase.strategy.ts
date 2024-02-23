import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Query, WhereFilterOp } from "firebase-admin/firestore";

import { DatabaseStrategy } from "../database";

type FirebaseTypes = {
    getDB: admin.firestore.Firestore;
    create: Promise<
        admin.firestore.DocumentReference<
            admin.firestore.DocumentData,
            admin.firestore.DocumentData
        >
    >;
    findAll: Promise<
        admin.firestore.QuerySnapshot<admin.firestore.DocumentData, admin.firestore.DocumentData>
    >;
    findOne: Promise<
        admin.firestore.DocumentSnapshot<admin.firestore.DocumentData, admin.firestore.DocumentData>
    >;
    update: Promise<admin.firestore.WriteResult>;
    delete: Promise<admin.firestore.WriteResult>;
    findWithQuery: unknown;
    operator: WhereFilterOp;
};

@Injectable()
export class FirebaseDatabase implements DatabaseStrategy<FirebaseTypes> {
    // TODO - bring changes to the database core class
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

    async findWithQuery<TData>(
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

        const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
        }));

        return data as TData[];
    }

    private removeUndefinedProperties(obj: Record<string, any>): Record<string, any> {
        return Object.entries(obj)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }
}

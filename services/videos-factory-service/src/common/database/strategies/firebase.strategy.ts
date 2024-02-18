import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

import { DatabaseStrategy } from "../database";

type FirebaseTypes = {
    getDB: admin.firestore.Firestore;
    get: Promise<admin.firestore.DocumentData>;
    set: Promise<admin.firestore.WriteResult>;
};

@Injectable()
export class FirebaseDatabase implements DatabaseStrategy<FirebaseTypes> {
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

    async get(collectionPath: string, documentId: string): Promise<admin.firestore.DocumentData> {
        const document = await this.getDB().collection(collectionPath).doc(documentId).get();
        return document.exists ? document.data() : null;
    }

    async set<TData>(
        collectionPath: string,
        documentId: string,
        data: TData
    ): Promise<admin.firestore.WriteResult> {
        return this.getDB().collection(collectionPath).doc(documentId).set(data);
    }
}

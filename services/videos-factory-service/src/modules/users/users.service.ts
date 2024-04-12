import { Injectable } from "@nestjs/common";
import { DAY_IN_SECONDS } from "src/common/constants";
import { addMonth } from "src/common/dates/dates.utils";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { PlansService } from "../plans/plans.service";
import { User } from "./users.types";

@Injectable()
export class UsersService {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly plansService: PlansService
    ) {}

    async getUserById(userId: string) {
        const user = await this.database.findOne<User>("users", userId);

        return user;
    }

    async createUser(userId: string) {
        const usersCollectionPath = `users`;
        const freePlan = await this.plansService.getFreePlan();

        const user: User = {
            id: userId,
            currentPlanId: "free",
            usageCycleEndsAt: addMonth(Date.now()),
            subscriptionStatus: "free",
            allowedStorage: freePlan.allowedStorage,
            allowedVideos: freePlan.allowedVideos,
            usedStorage: 0,
            usedVideos: 0,
            hasEarlyAdopterBadge: true,
        };

        await this.database.create(usersCollectionPath, user, userId);
    }

    async updateUser(userId: string, user: Partial<User>) {
        const usersCollectionPath = `users`;

        await this.database.update(usersCollectionPath, userId, user);
    }

    async refillUsersUsage() {
        const usersCollectionPath = `users`;
        const usageCycleEndtimeFrame = new Date().getTime() + DAY_IN_SECONDS * 1000;

        const updatedUsers: User[] = [];
        const users = await this.database.findWithQuery<User>(usersCollectionPath, {
            conditions: [{ field: "usageCycleEnd", operator: "<=", value: usageCycleEndtimeFrame }],
        });

        users.forEach((x) => {
            const newUser: User = {
                ...x,
                usedVideos: x.allowedVideos,
                usageCycleEndsAt: addMonth(x.usageCycleEndsAt),
            };

            updatedUsers.push(newUser);
        });

        try {
            await this.database.updateBatch(usersCollectionPath, updatedUsers);
        } catch (error) {
            console.log(error);
        }
    }
}

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DAY_IN_SECONDS } from "src/common/constants";
import { addMonth } from "src/common/dates/dates.utils";
import { PaymentService } from "src/common/payment/services/payment.service";
import { DatabaseConfig, InjectDatabase } from "src/config/database-config.module";

import { PlansService } from "../plans/plans.service";
import { VideosService } from "../videos/services/videos.service";
import { User } from "./users.types";

@Injectable()
export class UsersService {
    constructor(
        @InjectDatabase() private readonly database: DatabaseConfig,
        private readonly plansService: PlansService,
        private readonly payment: PaymentService,
        @Inject(forwardRef(() => VideosService)) private readonly videosService: VideosService
    ) {}

    async getUserById(userId: string) {
        const user = await this.database.findOne<User>("users", userId);

        return user;
    }

    async createUser(user: User) {
        const usersCollectionPath = `users`;
        const freePlan = await this.plansService.getFreePlan();
        console.log(user);

        const newUser: User = {
            ...user,
            currentPlanId: "free",
            usageCycleEndsAt: addMonth(Date.now()),
            subscriptionStatus: "trialing",
            billingStartsAt: 0,
            billingEndsAt: 0,
            allowedStorage: freePlan.allowedStorage,
            allowedVideos: freePlan.allowedVideos,
            usedStorage: 0,
            usedVideos: 0,
        };

        await this.database.createOrUpdate(usersCollectionPath, newUser);
    }

    async updateUser(userId: string, user: Partial<User>) {
        const usersCollectionPath = `users`;

        await this.database.update(usersCollectionPath, userId, user);
    }

    async deleteUser(userId: string) {
        console.log("deleteUser");

        const user = await this.getUserById(userId);
        console.log(userId, "userId");
        console.log(user, "user");

        try {
            await this.videosService.deleteUserVideos(userId);
            await this.database.deleteUser(userId);

            await this.database.delete("users", userId);

            if (user.subscriptionId !== "free") {
                await this.payment.cancelPlan(user.subscriptionId);
            }

            return { message: "User deleted with success" };
        } catch (error) {
            console.log(error, "deleteUser error");

            return { message: "Someting went wrong, check the logs" };
        }
    }

    async refillUsersUsage() {
        const usersCollectionPath = `users`;
        const usageCycleEndtimeFrame = new Date().getTime() + DAY_IN_SECONDS * 1000;

        const updatedUsers: User[] = [];
        const freePlan = await this.plansService.getFreePlan();
        const users = await this.database.findWithQuery<User>(usersCollectionPath, {
            conditions: [{ field: "usageCycleEnd", operator: "<=", value: usageCycleEndtimeFrame }],
        });

        users.forEach((x) => {
            const newUser: User = {
                ...x,
                usedVideos: 0,
                allowedStorage:
                    x.subscriptionStatus === "cancel" ? freePlan.allowedStorage : x.allowedStorage,
                allowedVideos:
                    x.subscriptionStatus === "cancel" ? freePlan.allowedVideos : x.allowedVideos,
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

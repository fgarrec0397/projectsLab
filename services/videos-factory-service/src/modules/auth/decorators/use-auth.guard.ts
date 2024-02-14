import { UseGuards } from "@nestjs/common";

import { FirebaseAuthGuard } from "../auth.guard";

export const UseAuthGuard = () => UseGuards(FirebaseAuthGuard);

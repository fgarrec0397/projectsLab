import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FirebaseAuthGuard extends AuthGuard("firebase-auth") {
    handleRequest(err, user) {
        if (err || !user) {
            throw (
                err || new UnauthorizedException("You are not authorized to access this resource")
            );
        }
        return user;
    }
}

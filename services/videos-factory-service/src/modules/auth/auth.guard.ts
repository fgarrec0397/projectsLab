import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class FirebaseAuthGuard extends AuthGuard("firebase-auth") {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isRoutePublic = this.reflector.get<boolean>("isPublic", context.getHandler());

        if (isRoutePublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw (
                err || new UnauthorizedException("You are not authorized to access this resource")
            );
        }
        return user;
    }
}

import { Cache, CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
    UseInterceptors,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

export const UseCache = () => UseInterceptors(CustomCacheInterceptor);

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor implements NestInterceptor {
    cacheManager: Cache;

    reflector: Reflector;

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache, reflector: Reflector) {
        super(cacheManager, reflector);

        this.cacheManager = cacheManager;
        this.reflector = reflector;
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const key = this.trackBy(context);
        const cachedResponse = await this.cacheManager.get(key);
        if (cachedResponse) {
            return of(cachedResponse);
        }
        return next.handle().pipe(tap((response) => this.cacheManager.set(key, response, 100)));
    }

    trackBy(context: ExecutionContext): string {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        return `${request.method}-${request.url}`;
    }
}

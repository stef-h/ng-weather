import { Inject, Injectable, InjectionToken } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";

import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CacheHttpInterceptorConfig } from "./cache-http-interceptor-config.type";
import { CacheService } from "../cache.service";

export const CACHE_HTTP_INTERCEPTOR_CONFIGS = new InjectionToken<
  CacheHttpInterceptorConfig[]
>("CacheHttpInterceptor Configuration");

/**
 * A HTTP interceptor that caches responses for GET requests
 * based on configurations for url prefixes and durations.
 */
@Injectable()
export class CacheHttpInterceptor implements HttpInterceptor {
  constructor(
    private cache: CacheService,
    @Inject(CACHE_HTTP_INTERCEPTOR_CONFIGS)
    private cacheConfigs: CacheHttpInterceptorConfig[]
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request is cachable
    // 1. If not a GET request, do not cache
    if (req.method !== "GET") {
      return next.handle(req);
    }
    // 2. If no cache config for the url exists, do not cache
    const cacheConfig = this.cacheConfigs.find((config) =>
      req.url.startsWith(config.urlPrefix)
    );
    if (!cacheConfig) {
      return next.handle(req);
    }

    // Check if requested url is in cache
    const cachedResponse = this.cache.get(req.url);
    if (cachedResponse) {
      const httpResponse = new HttpResponse({
        body: JSON.parse(cachedResponse).body,
      });
      // Return cached response (no HTTP request is made)
      return of(httpResponse);
    }

    // If not in cache, make request and cache response
    return next.handle(req).pipe(
      tap((response) => {
        if (response instanceof HttpResponse) {
          this.cache.set(
            req.url,
            JSON.stringify(response),
            cacheConfig.ttlInMilliseconds
          );
        }
      })
    );
  }
}

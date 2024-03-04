import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { CacheEntry } from "./cache-entry.type";
import { StorageService } from "app/storage/storage.service";
import { LoggingService } from "app/logging.service";

export const CACHE_STORAGE_KEY = new InjectionToken<string>(
  "Cache storage key token",
  {
    providedIn: "root",
    factory: () => "cache",
  }
);

/**
 * A token for a function that returns the current timestamp. Can be overriden for testing.
 */
export const TIMESTAMP_SERVICE = new InjectionToken<() => number>(
  "Timestamp service token",
  {
    providedIn: "root",
    factory: () => () => Date.now(),
  }
);

/**
 * The CacheService stores key-value pairs and adds a
 * timestamp to each entry.
 *
 * When retrieving a value, a maximum age must be provided.
 * If the entry is older than the maximum age, it is
 * considered outdated and removed from the cache.
 */
@Injectable()
export class CacheService {
  private cache: Map<string, CacheEntry> = new Map();

  constructor(
    @Inject(CACHE_STORAGE_KEY) private cacheStorageKey: string,
    @Inject(TIMESTAMP_SERVICE) private timestampService: () => number,
    private storage: StorageService,
    @Optional() private logger: LoggingService
  ) {
    const cacheString = this.storage.get(this.cacheStorageKey);

    if (cacheString) {
      const cacheEntries: CacheEntry[] = JSON.parse(cacheString);
      for (const entry of cacheEntries) {
        this.cache.set(entry.key, entry);
      }
    }
  }

  set(key: string, value: string, ttlInMilliseconds: number): void {
    const entry: CacheEntry = {
      key: key,
      value: value,
      maxAgeInMilliseconds: ttlInMilliseconds + this.timestampService(),
    };
    this.cache.set(key, entry);
    this.flush();
  }

  get(key: string): string | null {
    if (!this.cache.has(key)) {
      this.logger?.debug(
        `[${CacheService.name}] Cache miss (not found): ${key}`
      );
      return null;
    }

    const entry = this.cache.get(key);
    if (entry.maxAgeInMilliseconds < this.timestampService()) {
      this.logger?.debug(
        `[${CacheService.name}] Cache miss (outdated): ${key}`
      );
      this.flush();
      return null;
    }

    this.logger?.debug(`[${CacheService.name}] Cache hit: ${key}`);
    return entry.value;
  }

  private flush(): void {
    // Remove outdated entries
    const now = this.timestampService();
    this.cache.forEach((entry, key) => {
      if (entry.maxAgeInMilliseconds < now) {
        this.logger?.debug(
          `[${CacheService.name}] Removing outdated entry: ${entry.key}`
        );
        this.cache.delete(key);
      }
    });

    // Save to storage
    this.storage.set(
      this.cacheStorageKey,
      JSON.stringify([...this.cache.values()])
    );
  }
}

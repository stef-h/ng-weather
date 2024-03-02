import { Injectable } from "@angular/core";
import { CacheEntry } from "./cache-entry.type";
import { StorageService } from "app/storage/storage.service";
import { LoggingService } from "app/logging.service";

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
  constructor(
    private logger: LoggingService,
    private storage: StorageService
  ) {}

  set(key: string, value: string): void {
    const entry: CacheEntry = {
      value: value,
      timestamp: Date.now(),
    };
    this.storage.set(key, JSON.stringify(entry));
  }

  get(key: string, maxAgeInMilliseconds: number): string | null {
    const entryString = this.storage.get(key);

    if (entryString) {
      const entry: CacheEntry = JSON.parse(entryString);
      if (entry.timestamp + maxAgeInMilliseconds > Date.now()) {
        this.logger.debug(`[${CacheService.name}] Cache hit: ${key}`);
        return entry.value;
      } else {
        this.logger.debug(
          `[${CacheService.name}] Cache miss (outdated): ${key}`
        );
        this.storage.remove(key);
      }
    } else {
      this.logger.debug(
        `[${CacheService.name}] Cache miss (not found): ${key}`
      );
    }

    return null;
  }
}

import { Injectable } from "@angular/core";

/**
 * A service for storing and retrieving key-value pairs.
 *
 * This abstract class does not provide any information about
 * how or where the data is stored, or for how long the data
 * is available.
 */
@Injectable()
export abstract class StorageService {
  abstract get(key: string): string | null;
  abstract set(key: string, value: string): void;
  abstract remove(key: string): void;
}

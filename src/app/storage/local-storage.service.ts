import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

/**
 * An implementation of StorageService using the browser's localStorage API.
 */
@Injectable()
export class LocalStorageService extends StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

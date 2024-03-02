import { StorageService } from "./storage.service";

/**
 * An implementation of StorageService using non-persistent memory.
 */
export class MapStorageService extends StorageService {
  private map: Map<string, string> = new Map();

  get(key: string): string | null {
    return this.map.get(key);
  }

  set(key: string, value: string): void {
    this.map.set(key, value);
  }

  remove(key: string): void {
    this.map.delete(key);
  }
}

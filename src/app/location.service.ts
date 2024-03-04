import { Injectable } from "@angular/core";
import { ListStorageService } from "./storage/list/list-storage.service";

export const LOCATIONS_STORAGE_KEY: string = "locations";

@Injectable()
export class LocationService {
  constructor(private listStorage: ListStorageService) {}

  addLocation(zipcode: string) {
    if (!this.hasLocation(zipcode)) {
      this.listStorage.addValue(LOCATIONS_STORAGE_KEY, zipcode);
    }
  }

  removeLocation(zipcode: string) {
    if (this.hasLocation(zipcode)) {
      this.listStorage.removeValue(LOCATIONS_STORAGE_KEY, zipcode);
    }
  }

  hasLocation(zipcode: string): boolean {
    return this.listStorage.hasValue(LOCATIONS_STORAGE_KEY, zipcode);
  }
}

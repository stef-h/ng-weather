import { Injectable, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {
  ListStorageEventType,
  ListStorageEvent,
} from "./list-storage-event.type";
import { filter } from "rxjs/operators";
import { StorageService } from "../storage.service";

/**
 * A service for storing and updating lists of strings. The lists are identified by distinct keys.
 * Provides observables of events that fire when items are added or removed from a list.
 */
@Injectable()
export class ListStorageService {
  private storage = inject(StorageService);
  private listStorageEventSubject$ = new Subject<ListStorageEvent>();

  /**
   * Returns an observable that fires when items are added or removed
   * from the list identified by the given key.
   */
  getListStorageEvents(key: string): Observable<ListStorageEvent> {
    return this.listStorageEventSubject$
      .asObservable()
      .pipe(filter((event) => event.key === key));
  }

  getValues(key: string): string[] {
    const itemString = this.storage.get(key);
    return itemString ? JSON.parse(itemString) : [];
  }

  hasValue(key: string, value: string): boolean {
    return this.getValues(key).indexOf(value) !== -1;
  }

  addValues(key: string, ...values: string[]): string[] {
    const currentValues = this.getValues(key);
    const newValues = [...currentValues, ...values];
    this.storage.set(key, JSON.stringify(newValues));
    this.emit(ListStorageEventType.ADD, key, values);
    return newValues;
  }

  removeValues(key: string, ...values: string[]): string[] {
    const currentValues = this.getValues(key);
    const newValues = currentValues.filter((v) => values.indexOf(v) === -1);
    this.storage.set(key, JSON.stringify(newValues));
    this.emit(ListStorageEventType.REMOVE, key, values);
    return newValues;
  }

  private emit(
    type: ListStorageEventType,
    key: string,
    values: string[]
  ): void {
    this.listStorageEventSubject$.next({
      type: type,
      key: key,
      values: values,
    });
  }
}

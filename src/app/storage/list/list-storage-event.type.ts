export enum ListStorageEventType {
  ADD,
  REMOVE,
}

export interface ListStorageEvent {
  type: ListStorageEventType;
  key: string;
  values: string[];
}

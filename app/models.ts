export enum UpdateRecordStatus {
  ALL_UPDATED = 'ALL_UPDATED',
  UPDATING = 'UPDATING',
  CREATING = 'CREATING'
}

export interface TagModel {
  uuid?: string;
  name: string,
  type: string | null,
}

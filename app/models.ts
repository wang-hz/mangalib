export enum UpdateRecordStatus {
  ALL_UPDATED = 'ALL_UPDATED',
  UPDATING = 'UPDATING',
  CREATING = 'CREATING'
}

export interface TagModel {
  name: string,
  type: string,
}

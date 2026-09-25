type ActionType = 'Create' | 'Update' | 'Delete';
export type TAuditLogs = {
  actionType: ActionType;
  entityId: string;
  entityName: string;
  json: any;
  checksum: string;
  createdBy: string;
};

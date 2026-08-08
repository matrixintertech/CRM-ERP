export interface Permission {
  id: string;
  name: string;
  code: string;
  module: string;
}

export interface PermissionGroupData {
  module: string;
  permissions: Permission[];
}
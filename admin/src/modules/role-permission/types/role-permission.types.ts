export interface Permission {
  id: string;
  name: string;
  code: string;
  module: string;
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}
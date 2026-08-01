export type ModuleStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Module {
  id: string;

  uuid: string;

  name: string;

  code: string;

  description?: string;

  icon?: string;

  route?: string;

  parent?: {
    uuid: string;
    name: string;
  } | null;

  parentId?: string;

  sortOrder: number;

  isMenu: boolean;

  isVisible: boolean;

  isSystem: boolean;

  status: ModuleStatus;

  createdAt: string;

  updatedAt: string;
}

export interface ModuleFormData {
  name: string;

  code: string;

  description?: string;

  icon?: string;

  route?: string;

  parentId?: string;

  sortOrder: number;

  isMenu: boolean;

  isVisible: boolean;

  isSystem: boolean;

  status: ModuleStatus;
}

export interface ModuleListResponse {
  message: string;

  modules: Module[];
}

export interface ModuleResponse {
  message: string;

  module: Module;
}

export interface ModuleFormModalProps {
  open: boolean;

  loading?: boolean;

  initialValues?: Module;

  onClose: () => void;

  onSubmit: (
    values: ModuleFormData,
  ) => void;
}
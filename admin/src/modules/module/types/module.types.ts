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

  sortOrder: number;

  isSystem: boolean;

  status: ModuleStatus;

  createdAt: string;

  updatedAt: string;
}

export interface ModuleFormData {
  name: string;

  code: string;

  description: string;

  icon: string;

  route: string;

  sortOrder: number;

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


interface ModuleFormModalProps {
  open: boolean;

  loading?: boolean;

  initialValues?: Module;

  onClose: () => void;

  onSubmit: (
    values: ModuleFormData,
  ) => void;
}
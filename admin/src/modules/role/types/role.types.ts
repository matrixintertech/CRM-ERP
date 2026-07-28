export interface Role {
  id: string;

  companyId: string;

  name: string;

  code: string;

  description?: string;

  isSystem: boolean;

  status: string;
}

export interface RoleFormData {
  companyId: number;

  name: string;

  code: string;

  description: string;

  isSystem: boolean;
}
export type Status =
  | "ACTIVE"
  | "INACTIVE";

export interface ProjectCategory {
  uuid: string;
  name: string;
  code: string;
  description?: string | null;
  color?: string | null;
  sortOrder: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectCategoryDto {
  name: string;
  code: string;
  description?: string;
  color?: string;
  sortOrder?: number;
}

export interface UpdateProjectCategoryDto {
  name?: string;
  code?: string;
  description?: string;
  color?: string;
  sortOrder?: number;
  status?: Status;
}

export interface ProjectCategoryFormData {
  name: string;
  code: string;
  description?: string;
  color?: string;
  sortOrder?: number;
  status?: Status;
}
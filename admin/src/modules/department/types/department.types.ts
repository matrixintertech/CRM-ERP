export interface Department {
  id: number;
  uuid: string;

  name: string;
  code: string;
  description?: string | null;

  status: "ACTIVE" | "INACTIVE";

  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentDto
  extends Partial<CreateDepartmentDto> {}

export type DepartmentFormData =
  CreateDepartmentDto;
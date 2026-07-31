

export interface Designation {
  id: number;
  uuid: string;

  name: string;
  code: string;
  description?: string | null;

  status: "ACTIVE" | "INACTIVE";

  createdAt: string;
  updatedAt: string;
}

export interface CreateDesignationDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDesignationDto
  extends Partial<CreateDesignationDto> {}

export type DesignationFormData =
  CreateDesignationDto;
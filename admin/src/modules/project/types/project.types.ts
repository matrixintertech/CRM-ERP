export type Status = "ACTIVE" | "INACTIVE";

export interface Project {
  uuid: string;
  srn: string;
  name: string;

  address?: string | null;
  pincode?: string | null;

  startDate?: string | null;
  expectedEndDate?: string | null;

  remarks?: string | null;

  status: Status;

  client: {
    uuid: string;
    code: string;
    name: string;
    contactName: string;
    mobile: string;
  };

  state?: {
    uuid: string;
    name: string;
  } | null;

  city?: {
    uuid: string;
    name: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
}

export interface CreateProjectRequest {
  clientUuid: string;

  name: string;

  stateUuid?: string;
  cityUuid?: string;

  address?: string;
  pincode?: string;

  startDate?: string;
  expectedEndDate?: string;

  remarks?: string;
}

export interface UpdateProjectRequest
  extends Partial<CreateProjectRequest> {}
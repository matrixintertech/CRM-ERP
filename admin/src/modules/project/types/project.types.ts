export type Status =
  | "ACTIVE"
  | "INACTIVE";



export interface ProjectCategory {
  uuid: string;

  name: string;

  code: string;
}



export interface OrganizationUnit {
  uuid: string;

  name: string;

  code: string;

  type: string;
}



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



  category: ProjectCategory;



  organizationUnit: OrganizationUnit;



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


  categoryUuid?: string;

  organizationUnitUuid?: string;

  stateUuid?: string;

  cityUuid?: string;

}




export interface CreateProjectRequest {

  clientUuid: string;


  categoryUuid: string;


  organizationUnitUuid: string;


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
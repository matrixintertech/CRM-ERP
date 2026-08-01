export type CityStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface City {
  id: number;
  uuid: string;

  name: string;


  stateUuid: string;

  state: {
    uuid: string;
    name: string;
  };

  status: CityStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CityFormData {
  name: string;
  stateUuid: string;
  status: CityStatus;
}

export interface CityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CityStatus;
  stateUuid?: string;
}

export interface CityDropdown {
  uuid: string;
  name: string;
}
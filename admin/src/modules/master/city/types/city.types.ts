export interface City {
  id: number;
  uuid: string;
  name: string;
  stateUuid: string;

  state: {
    uuid: string;
    name: string;
  };

  status: "ACTIVE" | "INACTIVE";

  createdAt: string;
  updatedAt: string;
}

export interface CityFormData {
  name: string;
  code: string;
  stateUuid: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  stateUuid?: string;
}

export interface CityDropdown {
  uuid: string;
  name: string;
}
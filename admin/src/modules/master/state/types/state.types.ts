export interface State {
  id: number;
  uuid: string;
  name: string;
  code: string;
  gstCode?: string;
  status: "ACTIVE" | "INACTIVE";

  createdAt: string;
  updatedAt: string;
}

export interface StateFormData {
  name: string;
  code: string;
  gstCode: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface StateQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface StateDropdown {
  uuid: string;
  name: string;
}
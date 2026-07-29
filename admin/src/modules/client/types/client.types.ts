

export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface StateOption {
  uuid: string;
  name: string;
}

export interface CityOption {
  uuid: string;
  name: string;
}

export interface Client {
  uuid: string;

  name: string;
  code: string;

  contactName: string;
  mobile: string;
  email?: string | null;

  gstNumber?: string | null;
  panNumber?: string | null;

  address?: string | null;
  pincode?: string | null;

  remarks?: string | null;

  status: ClientStatus;

  state?: StateOption | null;
  city?: CityOption | null;

  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
}

export interface ClientQueryParams {
  page?: number;
  limit?: number;

  search?: string;
  status?: ClientStatus;
}

export interface CreateClientDto {
  name: string;
  code: string;

  contactName: string;
  mobile: string;
  email?: string;

  stateUuid?: string;
  cityUuid?: string;

  gstNumber?: string;
  panNumber?: string;

  address?: string;
  pincode?: string;

  remarks?: string;
}

export interface UpdateClientDto
  extends Partial<CreateClientDto> {
  status?: ClientStatus;
}
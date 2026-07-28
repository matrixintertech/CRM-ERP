import { UserType } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  companyId?: string | null;
  userType: UserType;
}
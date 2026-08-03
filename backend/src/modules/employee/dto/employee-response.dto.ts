import { ApiProperty } from "@nestjs/swagger";

import {
  EmploymentType,
  Gender,
  Status,
  UserStatus,
  UserType,
} from "@prisma/client";

class RelationDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  code?: string | null;
}

class ManagerDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  employeeCode?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  displayName?: string | null;
}

class UserRoleDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({
    enum: Status,
  })
  status: Status;
}

class UserDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  mobile?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  displayName?: string | null;

  @ApiProperty({
    enum: UserType,
  })
  userType: UserType;

  @ApiProperty({
    enum: UserStatus,
  })
  status: UserStatus;

  @ApiProperty({
    type: UserRoleDto,
    required: false,
    nullable: true,
  })
  role?: UserRoleDto | null;
}

export class EmployeeResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  employeeCode: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  lastName?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  displayName?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty()
  mobile: string;

  @ApiProperty({
    enum: Gender,
    required: false,
    nullable: true,
  })
  gender?: Gender | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  joiningDate?: Date | null;

  @ApiProperty({
    enum: EmploymentType,
    required: false,
    nullable: true,
  })
  employmentType?: EmploymentType | null;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  avatarUrl?: string | null;

  @ApiProperty({
    enum: Status,
  })
  status: Status;

  @ApiProperty({
    type: RelationDto,
    required: false,
    nullable: true,
  })
  organizationUnit?: RelationDto | null;

  @ApiProperty({
    type: RelationDto,
    required: false,
    nullable: true,
  })
  department?: RelationDto | null;

  @ApiProperty({
    type: RelationDto,
    required: false,
    nullable: true,
  })
  designation?: RelationDto | null;

  @ApiProperty({
    type: ManagerDto,
    required: false,
    nullable: true,
  })
  manager?: ManagerDto | null;

  @ApiProperty({
    type: UserDto,
    required: false,
    nullable: true,
  })
  user?: UserDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
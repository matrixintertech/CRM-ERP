import { ApiProperty } from "@nestjs/swagger";
import { EmploymentType, Gender, Status } from "@prisma/client";

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  employeeCode: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty({
    enum: Gender,
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    required: false,
    description: "Organization Unit UUID",
  })
  organizationUnitId?: string;

  @ApiProperty({
    required: false,
    description: "Department UUID",
  })
  departmentId?: string;

  @ApiProperty({
    required: false,
    description: "Designation UUID",
  })
  designationId?: string;

  @ApiProperty({
    required: false,
    description: "Reporting Manager UUID",
  })
  managerId?: string;

  @ApiProperty({
    required: false,
  })
  joiningDate?: Date;

  @ApiProperty({
    enum: EmploymentType,
  })
  employmentType: EmploymentType;

  @ApiProperty({
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({
    enum: Status,
  })
  status: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
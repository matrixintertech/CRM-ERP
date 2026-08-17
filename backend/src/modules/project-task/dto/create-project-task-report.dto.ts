import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";

import {
  ProjectTaskReportType,
} from "@prisma/client";


export class CreateProjectTaskReportDto {
  @IsEnum(
    ProjectTaskReportType,
  )
  type:
    ProjectTaskReportType;


  @IsString()
  @IsNotEmpty()
  @MaxLength(
    5000,
  )
  message:
    string;
}
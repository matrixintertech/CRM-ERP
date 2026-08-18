import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

import {
  Type,
} from "class-transformer";

import {
  ProjectTaskReportType,
} from "@prisma/client";

import {
  ProjectTaskReportAttachmentDto,
} from "./project-task-report-attachment.dto";


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


  /*
   * =========================================================
   * REPORT EVIDENCE ATTACHMENTS
   * =========================================================
   *
   * Images already R2/S3 par presigned PUT
   * ke through upload ho chuki hongi.
   *
   * Yahan sirf storage metadata receive hoga.
   *
   * Service actual object ko headObject()
   * ke through verify karegi before DB save.
   *
   * Maximum:
   * 5 images per report.
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(
    5,
  )
  @ValidateNested({
    each:
      true,
  })
  @Type(
    () =>
      ProjectTaskReportAttachmentDto,
  )
  attachments?:
    ProjectTaskReportAttachmentDto[];
}
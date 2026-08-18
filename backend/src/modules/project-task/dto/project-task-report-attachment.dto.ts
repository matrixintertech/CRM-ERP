import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";


const TASK_REPORT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;


export class ProjectTaskReportAttachmentDto {
  /*
   * Backend-generated storage key returned
   * by presigned upload endpoint.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  storageKey: string;


  /*
   * Original client filename.
   *
   * Example:
   * images.jpg
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  originalName: string;


  /*
   * Must match the MIME type used while
   * generating the presigned upload URL.
   */
  @IsString()
  @IsIn(
    TASK_REPORT_IMAGE_TYPES,
  )
  contentType:
    typeof TASK_REPORT_IMAGE_TYPES[number];


  /*
   * Client-declared size.
   *
   * Report service later R2 HEAD response
   * ke actual ContentLength se exact match
   * verify karegi.
   */
  @IsInt()
  @Min(1)
  @Max(
    5 * 1024 * 1024,
  )
  fileSize: number;
}
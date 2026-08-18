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


export class CreateProjectTaskReportUploadDto {
  /*
   * Original device/browser filename.
   *
   * Is filename ko storage key ke roop
   * me directly use nahi karenge.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;


  /*
   * Task evidence ke liye abhi sirf
   * supported image formats.
   */
  @IsString()
  @IsIn(
    TASK_REPORT_IMAGE_TYPES,
  )
  contentType:
    typeof TASK_REPORT_IMAGE_TYPES[number];


  /*
   * Maximum:
   * 5 MB per image.
   */
  @IsInt()
  @Min(1)
  @Max(
    5 * 1024 * 1024,
  )
  fileSize: number;
}
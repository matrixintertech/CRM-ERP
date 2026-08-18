import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";


export class CreatePresignedUploadDto {
  /*
   * Original client filename.
   *
   * Storage key me directly use nahi hoga.
   * Sirf extension / metadata ke liye.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;


  /*
   * Example:
   *
   * image/jpeg
   * image/png
   * image/webp
   *
   * Allowed MIME types business service
   * validate karegi.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contentType: string;


  /*
   * Client-side file size in bytes.
   *
   * Abhi absolute safety ceiling
   * 25 MB rakha hai.
   *
   * Task evidence service later
   * stricter 5 MB limit laga sakti hai.
   */
  @IsInt()
  @Min(1)
  @Max(
    25 * 1024 * 1024,
  )
  fileSize: number;
}
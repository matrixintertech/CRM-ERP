import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";


export class RequestProjectTaskCompletionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(
    5000,
  )
  message:
    string;
}
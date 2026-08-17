import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";


export enum ProjectTaskCompletionDecision {
  APPROVED =
    "APPROVED",

  REJECTED =
    "REJECTED",
}


export class ReviewProjectTaskCompletionDto {
  @IsEnum(
    ProjectTaskCompletionDecision,
  )
  decision:
    ProjectTaskCompletionDecision;


  @IsOptional()
  @IsString()
  @MaxLength(
    5000,
  )
  reviewNote?:
    string;
}
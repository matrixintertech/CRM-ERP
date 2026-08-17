import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

import {
  TaskPriority,
} from "@prisma/client";


export class CreateProjectTaskDto {
  @ApiProperty({
    example:
      "Install Ground Floor Cameras",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;


  @ApiPropertyOptional({
    example:
      "Install and test 8 CCTV cameras.",
  })
  @IsOptional()
  @IsString()
  description?: string;


  @ApiPropertyOptional({
    enum: TaskPriority,
    example:
      TaskPriority.HIGH,
    default:
      TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;


  @ApiPropertyOptional({
    example:
      "2026-08-10",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;


  @ApiPropertyOptional({
    example:
      "2026-08-11",
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;


  @ApiPropertyOptional({
    description:
      "UUID of an active project member to assign this task to.",
    example:
      "a9f76cf3-0ef1-4fd1-be29-307893249e3e",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assignedProjectMemberUuid?:
    | string
    | null;


  @ApiPropertyOptional({
    example:
      "Complete before client inspection.",
  })
  @IsOptional()
  @IsString()
  remarks?: string;


  @ApiPropertyOptional({
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
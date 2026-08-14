import {
  IsBoolean,
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
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  Status,
} from "@prisma/client";


export class CreateModuleDto {
  @ApiProperty({
    example: "Inventory",
    description:
      "Module name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;


  @ApiProperty({
    example: "INVENTORY",
    description:
      "Unique module code",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;


  @ApiPropertyOptional({
    example:
      "Inventory management module",
    description:
      "Module description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;


  @ApiPropertyOptional({
    example: "Package",
    description:
      "Lucide icon name",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;


  @ApiPropertyOptional({
    example: "/inventory",
    description:
      "Frontend route/path",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  route?: string;


  @ApiPropertyOptional({
    example:
      "8fdc11c2-f6d4-47fb-9a26-95ef35eab321",
    description:
      "Parent Module UUID (for submenu)",
  })
  @IsOptional()
  @IsUUID("4")
  parentId?: string;


  @ApiPropertyOptional({
    example: 5,
    description:
      "Display order",
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;


  @ApiPropertyOptional({
    example: true,
    description:
      "Show in sidebar/menu",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isMenu?: boolean;


  @ApiPropertyOptional({
    example: true,
    description:
      "Visible in UI",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;


  @ApiPropertyOptional({
    enum: Status,
    default: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

import {
  Status,
} from "@prisma/client";


export class ProjectCategoryResponseDto {

  @ApiProperty()
  uuid: string;


  @ApiProperty()
  name: string;


  @ApiProperty()
  code: string;


  @ApiPropertyOptional({
    nullable: true,
  })
  description?: string | null;


  @ApiPropertyOptional({
    nullable: true,

    example: "#3B82F6",
  })
  color?: string | null;


  @ApiProperty()
  sortOrder: number;


  @ApiProperty({
    enum: Status,
  })
  status: Status;


  @ApiProperty()
  createdAt: Date;


  @ApiProperty()
  updatedAt: Date;

}
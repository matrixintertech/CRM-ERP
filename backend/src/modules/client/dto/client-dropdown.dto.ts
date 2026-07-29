import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ClientDropdownDto {
  @ApiPropertyOptional({
    enum: Status,
    description: 'Filter clients by status',
    example: Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
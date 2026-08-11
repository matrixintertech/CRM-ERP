import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  Status,
} from '@prisma/client';

export class CreateClientDto {
  @ApiProperty({
    example:
      'ABC Interior Pvt Ltd',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name: string;

  @ApiProperty({
    example:
      'CLI000001',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  code: string;

  @ApiProperty({
    example:
      'Rahul Sharma',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  contactName: string;

  @ApiProperty({
    example:
      '9876543210',
  })
  @Matches(
    /^[6-9]\d{9}$/,
    {
      message:
        'Mobile number must be a valid 10-digit Indian mobile number.',
    },
  )
  mobile: string;

  @ApiPropertyOptional({
    example:
      'client@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example:
      '22AAAAA0000A1Z5',
  })
  @IsOptional()
  @IsString()
  @Length(15, 15)
  gstNumber?: string;

  @ApiPropertyOptional({
    example:
      'ABCDE1234F',
  })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  panNumber?: string;

  @ApiPropertyOptional({
    example:
      '2f66f8cb-7c89-4b2d-9d73-56d9cb3f7d9d',
  })
  @IsOptional()
  @IsUUID()
  stateUuid?: string;

  @ApiPropertyOptional({
    example:
      'aa6e9fd7-0c6b-4f7b-9b5b-8df7d8e5ef90',
  })
  @IsOptional()
  @IsUUID()
  cityUuid?: string;

  @ApiPropertyOptional({
    example:
      'Sector 63, Noida',
  })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  address?: string;

  @ApiPropertyOptional({
    example:
      '201301',
  })
  @IsOptional()
  @Matches(
    /^\d{6}$/,
    {
      message:
        'Pincode must be exactly 6 digits.',
    },
  )
  pincode?: string;

  @ApiPropertyOptional({
    example:
      'Preferred client',
  })
  @IsOptional()
  @IsString()
  @Length(2, 500)
  remarks?: string;

  @ApiPropertyOptional({
    enum:
      Status,
    default:
      Status.ACTIVE,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
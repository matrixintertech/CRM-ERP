import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'anil@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
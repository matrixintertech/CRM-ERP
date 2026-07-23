import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyResetOtpDto {
  @ApiProperty({
    example: 'anil@gmail.com',
  })
  @IsEmail()
  receiver: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
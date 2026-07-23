import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';

import { OtpChannel } from '@prisma/client';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'anil@gmail.com',
  })
  @IsEmail()
  receiver: string;

  @ApiProperty({
    enum: OtpChannel,
  })
  @IsEnum(OtpChannel)
  channel: OtpChannel;
}
import { ApiProperty } from '@nestjs/swagger';
import { OtpChannel } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email or mobile number',
  })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({
    enum: OtpChannel,
    example: OtpChannel.EMAIL,
  })
  @IsEnum(OtpChannel)
  channel: OtpChannel;
}
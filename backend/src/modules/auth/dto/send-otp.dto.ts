import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email or mobile number',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

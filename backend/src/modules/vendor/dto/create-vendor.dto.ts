import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";


export class CreateVendorDto {
  @IsString()
  @MaxLength(200)
  legalName: string;


  @IsOptional()
  @IsString()
  @MaxLength(200)
  displayName?: string;


  @IsOptional()
  @IsString()
  @MaxLength(20)
  panNumber?: string;


  @IsOptional()
  @IsString()
  @MaxLength(30)
  primaryGstNumber?: string;


  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;


  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobile?: string;


  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;


  @IsOptional()
  @IsString()
  address?: string;


  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;


  @IsOptional()
  @IsString()
  remarks?: string;
}
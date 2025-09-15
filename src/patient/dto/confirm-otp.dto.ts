import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class ConfirmOtpDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @IsNotEmpty()
  @IsString()
  patientId: string;
}

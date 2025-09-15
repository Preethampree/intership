import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class RequestOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @IsString()
  patientId: string;
}

import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterPatientDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('IN')
  phone: string;

  @MinLength(8)
  password: string;
}

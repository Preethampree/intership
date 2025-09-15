import { Body, Controller, Post } from '@nestjs/common';
import { PatientService } from './patient.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';

@Controller('api/v1')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  register(@Body() dto: RegisterPatientDto) {
    return this.patientService.register(dto);
  }

  @Post('verify/request')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.patientService.requestOtp(dto);
  }

  @Post('verify/confirm')
  confirmOtp(@Body() dto: ConfirmOtpDto) {
    return this.patientService.confirmOtp(dto);
  }
}

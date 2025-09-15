import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Otp } from '../entities/otp.entity';
import { RegisterPatientDto } from './dto/register-patient.dto';
import * as bcrypt from 'bcrypt';
import { RequestOtpDto } from './dto/request-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
  ) {}

  async register(dto: RegisterPatientDto) {
    const existingEmail = await this.patientRepo.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }
    const existingPhone = await this.patientRepo.findOne({ where: { phone: dto.phone } });
    if (existingPhone) {
      throw new BadRequestException('Phone already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const patient = this.patientRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });
    const saved = await this.patientRepo.save(patient);
    return { id: saved.id, message: 'Registration successful' };
  }

  async requestOtp(dto: RequestOtpDto) {
    const patient = await this.patientRepo.findOne({ where: { id: Number(dto.patientId) } });
    if (!patient) throw new BadRequestException('Patient not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otp = this.otpRepo.create({
      code,
      email: dto.email,
      phone: dto.phone,
      patient,
      expiresAt,
    });
    await this.otpRepo.save(otp);

    // Placeholder: log OTP instead of sending SMS/Email
    // eslint-disable-next-line no-console
    console.log('OTP for verification:', code);

    return { message: 'OTP generated' };
  }

  async confirmOtp(dto: ConfirmOtpDto) {
    const patient = await this.patientRepo.findOne({ where: { id: Number(dto.patientId) } });
    if (!patient) throw new BadRequestException('Patient not found');

    const otp = await this.otpRepo.findOne({
      where: {
        code: dto.code,
        email: dto.email,
        phone: dto.phone,
        patient: { id: patient.id },
        isVerified: false,
      },
      relations: ['patient'],
      order: { id: 'DESC' },
    });

    if (!otp) throw new BadRequestException('Invalid OTP');
    if (otp.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired');
    }

    otp.isVerified = true;
    await this.otpRepo.save(otp);

    return { message: 'Verification successful' };
  }
}

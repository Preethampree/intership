import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { AuthModule } from './auth/auth.module';
import { Otp } from './entities/otp.entity';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',       // or your DB host
      port: 5432,              // default PostgreSQL port
      username: 'postgres',    // your DB username
      password: '123456789',    // your DB password
      database: 'schedula_db', // your DB name
      entities: [User, Doctor, Patient, Otp],
      synchronize: true,       // auto-create tables (disable in production)
    }),
    TypeOrmModule.forFeature([User, Doctor, Patient, Otp]),
    AuthModule,
    PatientModule,
  ],
})
export class AppModule {}

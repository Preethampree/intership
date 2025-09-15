import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',       // or your DB host
      port: 5432,              // default PostgreSQL port
      username: 'postgres',    // your DB username
      password: '123456789',    // your DB password
      database: 'schedula_db', // your DB name
      entities: [User, Doctor, Patient],
      synchronize: true,       // auto-create tables (disable in production)
    }),
    TypeOrmModule.forFeature([User, Doctor, Patient]),
    AuthModule,
  ],
})
export class AppModule {}

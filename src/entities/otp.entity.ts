import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Patient } from './patient.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  code: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Patient, patient => patient.otps, { nullable: true, onDelete: 'CASCADE' })
  patient?: Patient;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findOrCreateUser(profile: any, role: string): Promise<User> {
    const { email, name } = profile;
    
    let user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      user = this.userRepository.create({
        email,
        name,
        role: role as 'doctor' | 'patient',
        provider: 'google',
        password: undefined,
      });
      await this.userRepository.save(user);
    }
    
    return user;
  }

  async generateJwtToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    
    return this.jwtService.sign(payload);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}

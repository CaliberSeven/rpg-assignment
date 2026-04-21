import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity.js';
import { AuthInput } from './dto/auth.input.js';
import { AuthPayload } from './models/auth-payload.model.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: AuthInput): Promise<AuthPayload> {
    const existing = await this.userRepo.findOne({ where: { username: input.username } });
    if (existing) {
      throw new ConflictException('Username already in use');
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.userRepo.create({ username: input.username, passwordHash });
    const saved = await this.userRepo.save(user);
    const token = this.jwtService.sign({ sub: saved.id, username: saved.username });
    return { token, user: saved };
  }

  async login(input: AuthInput): Promise<AuthPayload> {
    const user = await this.userRepo.findOne({ where: { username: input.username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return { token, user };
  }
}

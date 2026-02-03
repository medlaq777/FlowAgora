import bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../domain/interfaces/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private readonly repository: IUserRepository,
  ) { }

  async create(data: any) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return this.repository.create({ ...data, password: hashedPassword });
  }

  async findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }
}

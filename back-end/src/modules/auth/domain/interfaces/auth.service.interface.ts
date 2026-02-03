import { User } from '../../../users/domain/entities/user.entity';

export interface IAuthService {
  validateUser(email: string, pass: string): Promise<User | null>;
  login(user: User): Promise<{ access_token: string }>;
}


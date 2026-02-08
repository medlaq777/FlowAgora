import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation is successful', async () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'PARTICIPANT',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        id: 'user1',
        email: 'test@example.com',
        role: 'PARTICIPANT',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token with correct payload', async () => {
      const user: any = {
        id: 'user1',
        email: 'test@example.com',
        role: 'ADMIN',
      };
      jwtService.sign.mockReturnValue('generated_token');

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({ access_token: 'generated_token' });
    });
  });
});

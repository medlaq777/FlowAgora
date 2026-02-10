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

  describe('JWT Token Validation', () => {
    it('should include correct payload structure in token', async () => {
      const user: any = {
        id: 'user123',
        email: 'test@example.com',
        role: 'PARTICIPANT',
      };
      jwtService.sign.mockReturnValue('token_with_payload');

      await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user123',
        email: 'test@example.com',
        role: 'PARTICIPANT',
      });
    });

    it('should generate token for ADMIN role', async () => {
      const adminUser: any = {
        id: 'admin1',
        email: 'admin@flowagora.com',
        role: 'ADMIN',
      };
      jwtService.sign.mockReturnValue('admin_token');

      const result = await service.login(adminUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'admin1',
        email: 'admin@flowagora.com',
        role: 'ADMIN',
      });
      expect(result.access_token).toBe('admin_token');
    });

    it('should generate token for ORGANIZER role', async () => {
      const organizerUser: any = {
        id: 'org1',
        email: 'organizer@flowagora.com',
        role: 'ORGANIZER',
      };
      jwtService.sign.mockReturnValue('organizer_token');

      const result = await service.login(organizerUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'org1',
        email: 'organizer@flowagora.com',
        role: 'ORGANIZER',
      });
      expect(result.access_token).toBe('organizer_token');
    });

    it('should generate token for PARTICIPANT role', async () => {
      const participantUser: any = {
        id: 'part1',
        email: 'participant@example.com',
        role: 'PARTICIPANT',
      };
      jwtService.sign.mockReturnValue('participant_token');

      const result = await service.login(participantUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'part1',
        email: 'participant@example.com',
        role: 'PARTICIPANT',
      });
      expect(result.access_token).toBe('participant_token');
    });
  });

  describe('Edge Cases', () => {
    it('should handle email with special characters', async () => {
      const user = {
        id: 'user1',
        email: 'test+special@example.co.uk',
        password: 'hashedPassword',
        role: 'PARTICIPANT',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test+special@example.co.uk', 'password');

      expect(result).toBeDefined();
      expect(result?.email).toBe('test+special@example.co.uk');
    });

    it('should handle empty password', async () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', '');

      expect(result).toBeNull();
    });

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(1000);
      const user = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', longPassword);

      expect(result).toBeNull();
    });

    it('should handle case-sensitive email validation', async () => {
      const user = {
        id: 'user1',
        email: 'Test@Example.com',
        password: 'hashedPassword',
        role: 'PARTICIPANT',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('Test@Example.com', 'password');

      expect(result).toBeDefined();
      expect(result?.email).toBe('Test@Example.com');
    });

    it('should handle user with missing password field', async () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        password: undefined,
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should handle concurrent login attempts for same user', async () => {
      const user: any = {
        id: 'user1',
        email: 'test@example.com',
        role: 'PARTICIPANT',
      };
      jwtService.sign.mockReturnValue('concurrent_token');

      const results = await Promise.all([
        service.login(user),
        service.login(user),
        service.login(user),
      ]);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.access_token).toBe('concurrent_token');
      });
    });

    it('should handle user with all special characters in email', async () => {
      const user = {
        id: 'user1',
        email: 'test.name+tag@sub.example.co.uk',
        password: 'hashedPassword',
        role: 'ADMIN',
      };
      usersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test.name+tag@sub.example.co.uk', 'password');

      expect(result).toBeDefined();
      expect(result?.email).toBe('test.name+tag@sub.example.co.uk');
    });
  });
});

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsEnum(['ADMIN', 'PARTICIPANT'])
  @IsOptional()
  readonly role?: 'ADMIN' | 'PARTICIPANT';
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    example: 'PARTICIPANT',
    description: 'The role of the user',
    enum: ['ADMIN', 'PARTICIPANT'],
    required: false,
  })
  @IsString()
  @IsEnum(['ADMIN', 'PARTICIPANT'])
  @IsOptional()
  readonly role?: 'ADMIN' | 'PARTICIPANT';
}

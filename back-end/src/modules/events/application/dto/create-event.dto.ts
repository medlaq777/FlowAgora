import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2024', description: 'The title of the event' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ example: 'A conference about technology', description: 'The description of the event' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: '2024-12-01T09:00:00Z', description: 'The date of the event' })
  @IsDateString()
  @IsNotEmpty()
  readonly date: string;

  @ApiProperty({ example: 'San Francisco, CA', description: 'The location of the event' })
  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @ApiProperty({ example: 100, description: 'The capacity of the event' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly capacity: number;
}

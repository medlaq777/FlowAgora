import { ApiProperty } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto {
  @ApiProperty({ example: 'Tech Conference 2024', description: 'The title of the event', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({ example: 'A conference about technology', description: 'The description of the event', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: '2024-12-01T09:00:00Z', description: 'The date of the event', required: false })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  readonly date?: string;

  @ApiProperty({ example: 'San Francisco, CA', description: 'The location of the event', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly location?: string;
}

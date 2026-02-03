import { CreateEventDto } from './create-event.dto';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  readonly date?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly location?: string;
}

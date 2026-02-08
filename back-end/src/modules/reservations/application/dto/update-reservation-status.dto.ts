import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../../domain/entities/reservation.entity';

export class UpdateReservationStatusDto {
  @ApiProperty({
    example: 'CONFIRMED',
    description: 'The new status of the reservation',
    enum: ReservationStatus,
  })
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  readonly status: ReservationStatus;
}

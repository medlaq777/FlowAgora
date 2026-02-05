import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../../domain/entities/reservation.entity';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  readonly status: ReservationStatus;
}

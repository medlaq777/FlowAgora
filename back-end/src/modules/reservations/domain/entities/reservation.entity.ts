export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

export class Reservation {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly eventId: string,
    public readonly status: ReservationStatus = ReservationStatus.PENDING,
    public readonly createdAt: Date,
  ) {}
}

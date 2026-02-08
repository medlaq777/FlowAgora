import { EventStatus } from '../../domain/entities/event.entity';

export class EventResponseDto {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  status: EventStatus;
  reservedCount: number;
}

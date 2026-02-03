import type { Event as EventEntity } from '../entities/event.entity';
import { CreateEventDto } from '../../application/dto/create-event.dto';

export interface IEventRepository {
  create(data: CreateEventDto): Promise<EventEntity>;
  findAll(): Promise<EventEntity[]>;
  findById(id: string): Promise<EventEntity | null>;
}

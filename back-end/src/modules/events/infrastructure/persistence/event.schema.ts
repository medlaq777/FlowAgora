import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventStatus } from '../../domain/entities/event.entity';

export type EventDocument = EventModel & Document;

@Schema({ timestamps: true, collection: 'events' })
export class EventModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true, type: String, enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);

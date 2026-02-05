import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReservationStatus } from '../../domain/entities/reservation.entity';

export type ReservationDocument = ReservationModel & Document;

@Schema({ timestamps: true, collection: 'reservations' })
export class ReservationModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true, type: String, enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;
}

export const ReservationSchema = SchemaFactory.createForClass(ReservationModel);

ReservationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

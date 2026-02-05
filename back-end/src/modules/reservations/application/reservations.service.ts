import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReservationModel, ReservationDocument } from '../infrastructure/persistence/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '../domain/entities/reservation.entity';
import { EventModel, EventDocument } from '../../events/infrastructure/persistence/event.schema';
import { EventStatus } from '../../events/domain/entities/event.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(ReservationModel.name) private reservationModel: Model<ReservationDocument>,
    @InjectModel(EventModel.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string): Promise<ReservationDocument> {
    const { eventId } = createReservationDto;

    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Cannot reserve for an unpublished or canceled event');
    }

    // 3. Check for existing reservation
    const existingReservation = await this.reservationModel.findOne({
      userId,
      eventId,
      status: { $ne: ReservationStatus.CANCELED },
    }).exec();

    if (existingReservation) {
      throw new ConflictException('User already has a reservation for this event');
    }

    // 4. Check Capacity
    const reservationCount = await this.reservationModel.countDocuments({
      eventId,
      status: { $ne: ReservationStatus.CANCELED },
    }).exec();

    if (reservationCount >= event.capacity) {
      throw new ConflictException('Event is at full capacity');
    }

    // 5. Create Reservation
    const newReservation = new this.reservationModel({
      userId,
      eventId,
      status: ReservationStatus.PENDING,
    });

    return newReservation.save();
  }
}

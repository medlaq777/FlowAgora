import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EventModel,
  EventDocument,
} from '../infrastructure/persistence/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '../domain/entities/event.entity';
import { EventResponseDto } from './dto/event-response.dto';

import {
  ReservationModel,
  ReservationDocument,
} from '../../reservations/infrastructure/persistence/reservation.schema';
import { ReservationStatus } from '../../reservations/domain/entities/reservation.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventModel.name) private eventModel: Model<EventDocument>,
    @InjectModel(ReservationModel.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAllPublished(): Promise<EventResponseDto[]> {
    const events = await this.eventModel
      .find({ status: EventStatus.PUBLISHED })
      .lean()
      .exec();

    return Promise.all(
      events.map(async (event) => {
        const reservations = await this.reservationModel.countDocuments({
          eventId: event._id.toString(),
          status: {
            $nin: [ReservationStatus.CANCELED, ReservationStatus.REFUSED],
          },
        });
        return {
          ...event,
          _id: event._id.toString(),
          reservedCount: reservations,
        } as EventResponseDto;
      }),
    );
  }

  async findAll(): Promise<EventDocument[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventModel.findById(id).lean().exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const reservations = await this.reservationModel.countDocuments({
      eventId: id,
      status: { $nin: [ReservationStatus.CANCELED, ReservationStatus.REFUSED] },
    });

    return {
      ...event,
      _id: event._id.toString(),
      reservedCount: reservations,
    } as EventResponseDto;
  }

  async findOnePublic(id: string): Promise<EventResponseDto> {
    const event = await this.eventModel
      .findOne({ _id: id, status: EventStatus.PUBLISHED })
      .lean()
      .exec();
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${id} not found or not published`,
      );
    }

    const reservations = await this.reservationModel.countDocuments({
      eventId: id,
      status: { $nin: [ReservationStatus.CANCELED, ReservationStatus.REFUSED] },
    });

    return {
      ...event,
      _id: event._id.toString(),
      reservedCount: reservations,
    } as EventResponseDto;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventDocument> {
    const existingEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return existingEvent;
  }

  async updateStatus(id: string, status: EventStatus): Promise<EventDocument> {
    const existingEvent = await this.eventModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return existingEvent;
  }

  async findUpcoming(): Promise<EventDocument[]> {
    return this.eventModel
      .find({
        date: { $gte: new Date() },
        status: EventStatus.PUBLISHED,
      })
      .exec();
  }

  async getStats(id: string): Promise<{
    capacity: number;
    reservations: number;
    fillRate: number;
    breakdown: any;
  }> {
    const event = await this.findOne(id);

    const totalReservations = await this.reservationModel
      .countDocuments({
        eventId: id,
        status: {
          $nin: [ReservationStatus.CANCELED, ReservationStatus.REFUSED],
        },
      })
      .exec();

    const pending = await this.reservationModel
      .countDocuments({ eventId: id, status: ReservationStatus.PENDING })
      .exec();
    const confirmed = await this.reservationModel
      .countDocuments({ eventId: id, status: ReservationStatus.CONFIRMED })
      .exec();
    const canceled = await this.reservationModel
      .countDocuments({ eventId: id, status: ReservationStatus.CANCELED })
      .exec();
    const refused = await this.reservationModel
      .countDocuments({ eventId: id, status: ReservationStatus.REFUSED })
      .exec();

    const fillRate =
      event.capacity > 0 ? (totalReservations / event.capacity) * 100 : 0;

    return {
      capacity: event.capacity,
      reservations: totalReservations,
      fillRate: parseFloat(fillRate.toFixed(2)),
      breakdown: {
        PENDING: pending,
        CONFIRMED: confirmed,
        CANCELED: canceled,
        REFUSED: refused,
      },
    };
  }
}

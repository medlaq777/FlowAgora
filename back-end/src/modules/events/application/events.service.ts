import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventModel, EventDocument } from '../../infrastructure/persistence/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '../../domain/entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventModel.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAllPublished(): Promise<EventDocument[]> {
    return this.eventModel.find({ status: EventStatus.PUBLISHED }).exec();
  }

  async findAll(): Promise<EventDocument[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventDocument> {
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
}

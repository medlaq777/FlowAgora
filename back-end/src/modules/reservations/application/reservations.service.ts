import { BadRequestException, ConflictException, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
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

    const existingReservation = await this.reservationModel.findOne({
      userId,
      eventId,
      status: { $nin: [ReservationStatus.CANCELED, ReservationStatus.REFUSED] },
    }).exec();

    if (existingReservation) {
      throw new ConflictException('User already has a reservation for this event');
    }

    const reservationCount = await this.reservationModel.countDocuments({
      eventId,
      status: { $nin: [ReservationStatus.CANCELED, ReservationStatus.REFUSED] },
    }).exec();

    if (reservationCount >= event.capacity) {
      throw new ConflictException('Event is at full capacity');
    }

    const newReservation = new this.reservationModel({
      userId,
      eventId,
      status: ReservationStatus.PENDING,
    });

    return newReservation.save();
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<ReservationDocument> {
    const reservation = await this.reservationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async cancelByUser(id: string, userId: string): Promise<ReservationDocument> {
    const reservation = await this.reservationModel.findById(id).exec();
    
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CANCELED || reservation.status === ReservationStatus.REFUSED) {
        throw new BadRequestException('Reservation is already canceled or refused');
    }

    reservation.status = ReservationStatus.CANCELED;
    return reservation.save();
  }

  async generateTicket(reservationId: string, userId: string): Promise<Buffer> {
    const reservation = await this.reservationModel.findById(reservationId).exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found`);
    }

    if (reservation.userId !== userId) {      
      throw new ForbiddenException('You can only download your own ticket');
    }

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Ticket is only available for CONFIRMED reservations');
    }

    const event = await this.eventModel.findById(reservation.eventId).exec();
    if (!event) {
        throw new NotFoundException('Event not found');
    }

    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(25).text('TICKET DE RÉSERVATION', { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).text(`Événement: ${event.title}`);
      doc.fontSize(14).text(`Date: ${event.date}`);
      doc.text(`Lieu: ${event.location}`);
      doc.moveDown();
      doc.text(`Réservé par: ${userId}`);
      doc.text(`ID Réservation: ${reservation.id}`);
      doc.text(`Statut: ${reservation.status}`);
      
      doc.end();
    });
  }

  async findByEvent(eventId: string): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ eventId }).exec();
  }

  async findByUser(userId: string): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ userId }).exec();
  }
}

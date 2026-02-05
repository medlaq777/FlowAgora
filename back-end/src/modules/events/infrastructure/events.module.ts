import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from '../application/events.controller';
import { EventsService } from '../application/events.service';
import { EventModel, EventSchema } from './persistence/event.schema';
import { ReservationModel, ReservationSchema } from '../../reservations/infrastructure/persistence/reservation.schema'; // Correct relative path

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventModel.name, schema: EventSchema },
      { name: ReservationModel.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsController } from '../application/reservations.controller';
import { ReservationsService } from '../application/reservations.service';
import { ReservationModel, ReservationSchema } from './persistence/reservation.schema';
import { EventModel, EventSchema } from '../../events/infrastructure/persistence/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReservationModel.name, schema: ReservationSchema },
      { name: EventModel.name, schema: EventSchema },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}

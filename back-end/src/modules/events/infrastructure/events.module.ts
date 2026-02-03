import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from '../application/events.controller';
import { EventsService } from '../application/events.service';
import { EventModel, EventSchema } from './persistence/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventModel.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

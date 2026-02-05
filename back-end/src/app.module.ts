import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { UsersModule } from './modules/users/infrastructure/users.module';
import { EventsModule } from './modules/events/infrastructure/events.module';
import { ReservationsModule } from './modules/reservations/infrastructure/reservations.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, EventsModule, ReservationsModule],
})
export class AppModule {}

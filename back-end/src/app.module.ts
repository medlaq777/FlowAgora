import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { UsersModule } from './modules/users/infrastructure/users.module';
import { EventsModule } from './modules/events/infrastructure/events.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, EventsModule],
})
export class AppModule {}

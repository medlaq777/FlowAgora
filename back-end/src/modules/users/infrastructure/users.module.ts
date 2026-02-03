import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../application/users.service';
import { UsersController } from '../application/users.controller';
import { UserRepositoryImpl } from './user.repository.impl';
import { UserDocument, UserSchema } from './persistence/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UsersService],
})
export class UsersModule { }

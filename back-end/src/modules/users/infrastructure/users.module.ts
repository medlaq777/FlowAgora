import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../application/users.service';
import { UserRepositoryImpl } from './user.repository.impl';
import { UserDocument, UserSchema } from './persistence/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
  ],
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

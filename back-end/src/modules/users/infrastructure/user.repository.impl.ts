import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { User } from '../domain/entities/user.entity';
import { UserDocument } from './persistence/user.schema';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return this.toEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.toEntity(user);
  }

  async create(user: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.toEntity(savedUser);
  }

  private toEntity(userDocument: UserDocument): User {
    return new User(
      userDocument._id.toString(),
      userDocument.email,
      userDocument.password,
      userDocument.role as 'ADMIN' | 'PARTICIPANT',
      userDocument.firstName,
      userDocument.lastName,
    );
  }
}
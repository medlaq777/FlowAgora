import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDocument extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: 'PARTICIPANT' })
  role: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
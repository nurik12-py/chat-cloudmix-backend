import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  @IsEmail()
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true })
  firstname: string;

  @Prop()
  lastname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

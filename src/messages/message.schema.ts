import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true, default: Date.now })
  date: string;

  @Prop({ required: true, minlength: 1 })
  text: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

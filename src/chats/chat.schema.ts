import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  botName: string;

  @Prop()
  messages: any[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

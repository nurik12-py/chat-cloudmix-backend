import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';

import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}

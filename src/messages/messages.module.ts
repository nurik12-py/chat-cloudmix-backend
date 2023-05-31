import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './message.schema';
import { ChatsModule } from 'src/chats/chats.module';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    ChatsModule,
    OpenaiModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}

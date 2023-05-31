import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}

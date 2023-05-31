import { Module } from '@nestjs/common';
import { ChatsModule } from './chats/chats.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiModule } from './openai/openai.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'cloudmix',
    }),
    ChatsModule,
    AuthModule,
    UsersModule,
    OpenaiModule,
    MessagesModule,
  ],
})
export class AppModule {}

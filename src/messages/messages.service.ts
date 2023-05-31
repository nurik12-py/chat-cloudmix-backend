import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageDocument } from './message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatsService } from 'src/chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return this.messageModel.create(createMessageDto);
  }

  findAllByChatId(chatId: string) {
    return this.messageModel.find({ chatId }).exec();
  }

  findOne(id: string) {
    return this.messageModel.findById(id).exec();
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.updateOne({ _id: id }, updateMessageDto).exec();
  }

  remove(id: string) {
    return this.messageModel.deleteOne({ _id: id }).exec();
  }
}

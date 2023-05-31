import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument } from './chat.schema';

@Injectable()
export class ChatsService {
  constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>) {}

  create(createChatDto: CreateChatDto) {
    return this.chatModel.create(createChatDto);
  }

  findAll(userId: string) {
    return this.chatModel.find({ userId: userId }).exec();
  }

  findOne(id: string) {
    return this.chatModel.findById(id).exec();
  }

  update(id: string, updateChatDto: UpdateChatDto) {
    return this.chatModel.updateOne({ _id: id }, updateChatDto).exec();
  }

  remove(id: string) {
    return this.chatModel.deleteOne({ _id: id }).exec();
  }
}

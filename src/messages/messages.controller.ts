import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatsService } from 'src/chats/chats.service';
import { AuthorizedRequest } from 'src/types/AuthorizedRequest';
import { OpenAIService } from 'src/openai/openai.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
    private readonly openAIService: OpenAIService,
  ) {}

  @Post()
  async create(
    @Req() req: AuthorizedRequest,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const { chatId, text } = createMessageDto;

    const chat = await this.chatsService.findOne(chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.userId !== req.user.id) {
      throw new Error('Unauthorized access');
    }

    await this.messagesService.create({ chatId, text, sender: req.user.id });

    const response = await this.openAIService.generateCompletion(text);

    await this.messagesService.create({
      chatId,
      sender: 'bot',
      text: response,
    });

    return response;
  }

  @Get(':chatId')
  findAll(@Param('chatId') chatId: string) {
    return this.messagesService.findAllByChatId(chatId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messagesService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}

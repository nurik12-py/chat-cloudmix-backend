import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from 'unique-names-generator';
import { ChatsService } from './chats.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthorizedRequest } from 'src/types/AuthorizedRequest';
import { MessagesService } from 'src/messages/messages.service';
import { OpenAIService } from 'src/openai/openai.service';
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly openAIService: OpenAIService,
  ) {}

  @Post()
  createChat(@Req() req: AuthorizedRequest) {
    const decodedToken = req.user;
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      separator: ' ',
      style: 'capital',
    });
    return this.chatsService.create({
      botName: randomName,
      userId: decodedToken.id,
    });
  }

  @Get()
  findAllChats(@Req() req: AuthorizedRequest) {
    return this.chatsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOneChat(@Req() req: AuthorizedRequest, @Param('id') id: string) {
    const chatRecord = await this.chatsService.findOne(id);

    if (chatRecord.userId !== req.user.id) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return this.chatsService.findOne(id);
  }

  @Patch(':id')
  async updateChat(
    @Req() req: AuthorizedRequest,
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    const chatRecord = await this.chatsService.findOne(id);

    if (chatRecord.userId !== req.user.id) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return this.chatsService.update(id, updateChatDto);
  }

  @Delete(':id')
  async removeChat(@Req() req: AuthorizedRequest, @Param('id') id: string) {
    const chatRecord = await this.chatsService.findOne(id);

    if (chatRecord.userId !== req.user.id) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return this.chatsService.remove(id);
  }

  @Post(':chatId/messages')
  async createMesssage(
    @Req() req: AuthorizedRequest,
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const { text } = createMessageDto;

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

  @Get(':chatId/messages')
  findAllMessages(
    @Param('chatId') chatId: string,
    @Query('limit') limit = 25,
    @Query('offset') offset = 0,
  ) {
    return this.messagesService.findAllByChatId(chatId, limit, offset);
  }

  @Patch(':chatId/messages')
  updateMessage(
    @Param('chatId') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':chatsId/messages')
  removeMessage(@Param('chatId') id: string) {
    return this.messagesService.remove(id);
  }
}

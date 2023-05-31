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
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthorizedRequest } from 'src/types/AuthorizedRequest';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Req() req: AuthorizedRequest, @Body() createChatDto: CreateChatDto) {
    const decodedToken = req.user;
    return this.chatsService.create({
      ...createChatDto,
      userId: decodedToken.id,
    });
  }

  @Get()
  findAll(@Req() req: AuthorizedRequest) {
    return this.chatsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req: AuthorizedRequest, @Param('id') id: string) {
    const chatRecord = await this.chatsService.findOne(id);

    if (chatRecord.userId !== req.user.id) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return this.chatsService.findOne(id);
  }

  @Patch(':id')
  async update(
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
  async remove(@Req() req: AuthorizedRequest, @Param('id') id: string) {
    const chatRecord = await this.chatsService.findOne(id);

    if (chatRecord.userId !== req.user.id) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return this.chatsService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto, CreateCommentDto } from 'src/dto/comment.dto';
import mongoose from 'mongoose';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() dto: CreateCommentDto): Promise<CommentDto> {
    return this.commentService.createComment(dto);
  }

  @Get(':mediaId')
  async findByMediaId(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 12,
    @Param('mediaId') id: mongoose.ObjectId,
  ): Promise<{ data: CommentDto[]; total: number }> {
    return this.commentService.findByMediaId(id, page, limit);
  }

  @Get()
  async findAndCount() {
    return null;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return null;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return null;
  }
}

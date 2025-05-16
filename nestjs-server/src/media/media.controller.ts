import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MediaService } from './media.service';
import { CreateMediaDto, MediaDto } from 'src/dto/media.dto';

import { v4 as uuid4 } from 'uuid';
import { Types } from 'mongoose';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'C:/my-site/uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${uuid4()}`;
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}.${ext}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadMedia(
    @Body() dto: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MediaDto> {
    return this.mediaService.uploadMedia(dto, file);
  }

  @Post('like/:mediaId')
  async likeMedia(@Param('mediaId') id: string): Promise<MediaDto> {
    return this.mediaService.rateMedia(new Types.ObjectId(id), 1);
  }

  @Post('dislike/:mediaId')
  async dislikeMedia(@Param('mediaId') id: string): Promise<MediaDto> {
    return this.mediaService.rateMedia(new Types.ObjectId(id), -1);
  }

  @Get()
  async getMedia(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 12,
  ): Promise<{ data: MediaDto[]; total: number }> {
    return this.mediaService.findAll(page, limit);
  }
}

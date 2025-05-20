import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
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

import { Types } from 'mongoose';
import { VARS } from 'src/vars.enum';
import { CategoryDto } from 'src/dto/category.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: VARS.STATIC_STORAGE as string,
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${new Types.ObjectId()}`;
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}.${ext}`);
        },
      }),
      limits: { fileSize: VARS.MAX_FILE_SIZE_MB * 1024 * 1024 },
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

  // @Get()
  // async getMedia(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  // ): Promise<{ data: MediaDto[]; total: number }> {
  //   return this.mediaService.findAll(page, limit);
  // }

  @Get('categories')
  async getCategories(): Promise<CategoryDto[]> {
    return this.mediaService.getCategories();
  }

  @Get()
  async getMedia(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    @Query(
      'categories',
      // 1) default to [] (so ParseArrayPipe sees an array and skips parsing)
      new DefaultValuePipe([] as string[]),
      // 2) parse only if it's a string
      new ParseArrayPipe({ items: String, separator: ',' }),
    )
    categories: string[],
  ): Promise<{ data: MediaDto[]; total: number }> {
    return this.mediaService.getMediaByCategories(page, limit, categories);
  }
}

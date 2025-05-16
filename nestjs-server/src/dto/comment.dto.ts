import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsMongoId,
  MaxLength,
} from 'class-validator';
import mongoose from 'mongoose';

export class CommentDto {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: 'Когда создано',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Когда обновлено',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  updatedAt: string;

  @IsNotEmpty()
  @IsMongoId()
  mediaId: mongoose.Types.ObjectId;

  @MaxLength(1024)
  @IsString()
  @IsNotEmpty()
  content: string;

  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  authorName: string;
}

export class CreateCommentDto extends PickType(CommentDto, [
  'mediaId',
  'content',
  'authorName',
] as const) {}

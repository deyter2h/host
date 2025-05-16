import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';
import mongoose from 'mongoose';

export class MediaDto {
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

  @ApiProperty({ description: 'Название медиа' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['image', 'video'] })
  @IsEnum(['image', 'video'] as const)
  type: 'image' | 'video';

  @ApiProperty({ description: 'Имя автора' })
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiProperty({ description: 'URL медиа-файла' })
  @IsString()
  @IsNotEmpty()
  url: string; //filepath for now

  @ApiProperty({ description: 'URL preview медиа-файла' })
  @IsString()
  @IsNotEmpty()
  previewUrl: string; //filepath for now

  @ApiProperty({ description: 'Описание медиа-файла' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String, example: '["travel","food"]' })
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({ description: 'MIME-тип файла' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ required: false, description: 'Размер файла в байтах' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  sizeBytes?: number;

  @ApiProperty({ description: 'Rating' })
  @IsNumber()
  rating: number;
}

export class CreateMediaDto extends PickType(MediaDto, [
  'name',
  'description',
  'categories',
] as const) {}

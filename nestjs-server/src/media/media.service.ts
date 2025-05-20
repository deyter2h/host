// src/media/media.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Media, MediaDocument } from '../schemas/media.schema';
import { CreateMediaDto, MediaDto } from 'src/dto/media.dto';
import { generatePreview } from './media.generate.preview';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { promises as fs } from 'fs';
import { CategoryDto } from 'src/dto/category.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async uploadMedia(
    dto: CreateMediaDto,
    file: Express.Multer.File,
  ): Promise<MediaDto> {
    if (!file) {
      throw new BadRequestException('No file received');
    }

    const fileTypeMod: any = await import('file-type');

    const filePath = file.path;
    const buffer = await fs.readFile(filePath);
    const type = await fileTypeMod.fileTypeFromBuffer(buffer);
    if (
      !type ||
      (!type.mime.startsWith('image/') && !type.mime.startsWith('video/'))
    ) {
      throw new BadRequestException('Invalid or corrupted file');
    }

    if (!Array.isArray(dto.categories)) {
      throw new BadRequestException('No categories provided');
    }

    const previewSource = await generatePreview(file);

    // Upsert categories and collect their names
    const catDocs = await Promise.all(
      dto.categories.map((name) =>
        this.categoryModel
          .findOneAndUpdate(
            { name },
            { name },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          )
          .exec(),
      ),
    );

    const doc = {
      ...dto,
      _id: new Types.ObjectId(file.filename.split('.')[0]),
      source: file.filename,
      previewSource,
      type: type.mime.startsWith('image/') ? 'image' : 'video',
      categories: Array.from(new Set(catDocs.map((c) => c._id))),
      authorName: 'from-auth',
      mimeType: file.mimetype,
      sizeBytes: file.size,
      rating: 0,
    };

    const created = await this.mediaModel.create(doc);
    return created.populate('categories', 'name');
  }

  async rateMedia(mediaId: Types.ObjectId, rate: number): Promise<MediaDto> {
    const media = await this.mediaModel.findById(mediaId);
    if (!media) throw new NotFoundException('Media not found');
    media.rating += rate;
    const updated = await media.save();
    return updated.populate('categories', 'name');
  }

  async getCategories(): Promise<CategoryDto[]> {
    const res = await this.categoryModel.find().exec();
    return res.map((e) => ({ _id: e._id, name: e.name }));
  }

  async getMediaByCategories(
    page: number,
    limit: number,
    categoryIds: string[],
  ): Promise<any> {
    //{ data: MediaDto[]; total: number }
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (categoryIds.length) {
      const objectIds = categoryIds.map((id) => {
        if (!Types.ObjectId.isValid(id)) {
          throw new BadRequestException(`Invalid category id: ${id}`);
        }
        return new Types.ObjectId(id);
      });
      filter.categories = { $in: objectIds };
    }

    const [docs, total] = await Promise.all([
      this.mediaModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('categories', 'name')
        .exec(),
      this.mediaModel.countDocuments(filter).exec(),
    ]);

    return {
      data: docs,
      total,
    };
  }
}

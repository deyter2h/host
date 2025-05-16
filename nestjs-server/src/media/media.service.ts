// media/media.service.ts

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
    let type = 'no-type';

    if (file.mimetype.startsWith('image/')) type = 'image';
    else if (file.mimetype.startsWith('video/')) type = 'video';
    else throw new BadRequestException('Wrong upload file format');

    const previewName = await generatePreview(file);

    const providedCategories = dto.categories;

    if (!Array.isArray(providedCategories)) {
      throw new BadRequestException('No categories provided');
    }

    const catNames = new Set<string>();

    // Sequentially await each upsert
    for (const cat of providedCategories) {
      await this.categoryModel.findOneAndUpdate(
        { name: cat },
        { name: cat },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      catNames.add(cat);
    }

    const doc = {
      ...dto,
      type,
      categories: [...catNames],
      previewUrl: previewName,
      authorName: 'from-auth',
      url: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      rating: 0,
    };

    const res = await this.mediaModel.create(doc);
    return { ...res.toObject(), categories: [...catNames] };
  }

  async rateMedia(mediaId: Types.ObjectId, rate: number): Promise<MediaDto> {
    const media = await this.mediaModel.findById(mediaId);

    if (!media) throw new NotFoundException('Media not found');

    media.rating += rate;
    return await media.save();
  }

  async findAll(
    page = 1,
    limit = 12,
  ): Promise<{ data: MediaDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.mediaModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.mediaModel.countDocuments().exec(),
    ]);

    const data: MediaDto[] = docs.map((doc) => ({
      _id: doc._id,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      name: doc.name,
      type: doc.type,
      authorName: doc.authorName,
      url: doc.url,
      previewUrl: doc.previewUrl,
      mimeType: doc.mimeType,
      description: doc.description,
      categories: doc.categories,
      sizeBytes: doc.sizeBytes,
      rating: doc.rating,
    }));

    return { data, total };
  }
}

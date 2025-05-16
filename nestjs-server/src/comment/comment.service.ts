import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommentDto, CreateCommentDto } from 'src/dto/comment.dto';
import { CommentDocument } from 'src/schemas/comment.schema';
import { Comment } from 'src/schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}
  async createComment(dto: CreateCommentDto): Promise<CommentDto> {
    const mediaExists = await this.commentModel.findById(dto.mediaId);

    if (!mediaExists) throw new NotFoundException('Media not found');

    const res = await this.commentModel.create(dto);
    return res;
  }

  async findByMediaId(
    id: mongoose.ObjectId,
    page: number,
    limit: number,
  ): Promise<{ data: CommentDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.commentModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments().exec(),
    ]);

    return { data: docs, total };
  }
}

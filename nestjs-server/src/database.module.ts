import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { Media, MediaSchema } from './schemas/media.schema';
import { CommentSchema } from './schemas/comment.schema';
import { Comment } from './schemas/comment.schema';
import { Category, CategorySchema } from './schemas/category.schema';
dotenv.config();

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/media-host', {}),
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

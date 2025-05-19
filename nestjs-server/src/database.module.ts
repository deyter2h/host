import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { CommentSchema } from './schemas/comment.schema';
import { Comment } from './schemas/comment.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { VARS } from './vars.enum';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(VARS.MONGO_URL, {}),
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

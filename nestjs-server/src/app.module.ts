import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MediaModule } from './media/media.module';
import { DatabaseModule } from './database.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../uploads'),
      serveRoot: '/static',
      serveStaticOptions: { index: false },
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    MediaModule,
    CommentModule,
  ],
})
export class AppModule {}

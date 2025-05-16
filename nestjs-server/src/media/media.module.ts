import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { DatabaseModule } from 'src/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}

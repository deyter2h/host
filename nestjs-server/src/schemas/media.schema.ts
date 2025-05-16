import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Media {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['image', 'video'],
  })
  type: 'image' | 'video';

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  previewUrl: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  categories: string[];

  @Prop({ required: true })
  sizeBytes?: number;

  @Prop({ required: true })
  rating: number;

  createdAt: string;
  updatedAt: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

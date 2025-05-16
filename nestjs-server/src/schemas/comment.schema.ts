// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Media } from './media.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  _id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: Media.name, required: true })
  mediaId: Types.ObjectId;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

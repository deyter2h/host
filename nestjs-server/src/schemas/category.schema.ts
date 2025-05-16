import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  _id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;

  @Prop({ required: true, unique: true, index: true })
  name: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ name: 1 }, { unique: true });

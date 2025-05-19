import { IsString, IsNotEmpty, IsMongoId, MaxLength } from 'class-validator';
import mongoose from 'mongoose';

export class CategoryDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  name: string;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Review {
  @Prop({ required: true, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: 'Institution' })
  institutionId: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  grade: number;

  @Prop()
  description: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
export type ReviewDocument = Review & Document;

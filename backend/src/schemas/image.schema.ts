import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, Document } from 'mongoose';

@Schema()
export class Image {
  @Prop({
    required: true,
    ref: 'Establishment',
  })
  establishmentId: mongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    ref: 'User',
  })
  userId: mongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  image: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
export type ImageDocument = Image & Document;

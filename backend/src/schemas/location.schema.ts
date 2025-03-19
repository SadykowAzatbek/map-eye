import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, Document } from 'mongoose';

@Schema()
export class Location {
  @Prop({
    required: true,
    ref: 'User',
  })
  userId: mongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  altSpellings: string[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
export type LocationDocument = Location & Document;

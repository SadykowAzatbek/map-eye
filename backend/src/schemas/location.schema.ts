import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, Document } from 'mongoose';

@Schema()
export class Location {
  @Prop({
    required: true,
    ref: 'User',
  })
  userId: mongooseSchema.Types.ObjectId;

  @Prop()
  location: string;

  @Prop()
  city: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
export type LocationDocument = Location & Document;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, Document } from 'mongoose';

@Schema()
export class Institution {
  @Prop({
    required: true,
    ref: 'User',
  })
  userId: mongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop({
    type: Object,
    required: true,
    default: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  })
  schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, default: false })
  approved: boolean;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);

export type InstitutionDocument = Institution & Document;

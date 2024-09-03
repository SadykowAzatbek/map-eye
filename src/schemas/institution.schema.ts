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

  @Prop({
    required: true,
    type: Object,
    default: {
      start: 0,
      finish: 0,
    },
  })
  workingHours: {
    start: number;
    finish: number;
  };

  @Prop({ required: true })
  address: string;

  @Prop({
    type: [Number],
    required: true,
    validate: {
      validator: (v: number[]) => {
        return v.length === 2;
      },
      message: (props) => `${props.value} должно содержать ровно два элемента.`,
    },
  })
  coordinates: [number, number];
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);

export type InstitutionDocument = Institution & Document;

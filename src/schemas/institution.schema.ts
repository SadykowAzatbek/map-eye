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
    type: Array,
    required: true,
    default: [
      { day: 'monday', open: true },
      { day: 'tuesday', open: true },
      { day: 'wednesday', open: true },
      { day: 'thursday', open: true },
      { day: 'friday', open: true },
      { day: 'saturday', open: false },
      { day: 'sunday', open: false },
    ],
  })
  openingDays: {
    day: string;
    open: boolean;
  }[];

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, default: false })
  approved: boolean;

  @Prop({
    required: true,
    type: Object,
    default: {
      start: '00:00',
      finish: '00:00',
    },
  })
  workingHours: {
    start: string;
    finish: string;
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

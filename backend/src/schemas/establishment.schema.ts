import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, Document } from 'mongoose';

@Schema()
export class Establishment {
  @Prop({
    required: true,
    ref: 'User',
  })
  userId: mongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: Object,
    required: true,
    default: { break: false, start: '11:00', finish: '12:00' },
  })
  break: {
    break: boolean;
    day: string;
    finish: string;
  };

  @Prop({
    type: Array,
    required: true,
    default: [
      {
        day: 'Пн',
        open: true,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
      {
        day: 'Вт',
        open: true,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
      {
        day: 'Ср',
        open: true,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
      {
        day: 'Чт',
        open: true,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
      {
        day: 'Пт',
        open: true,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
      {
        day: 'Сб',
        open: false,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
      {
        day: 'Вс',
        open: false,
        start: '9:00',
        finish: '18:00',
        twentyFourHours: false,
      },
    ],
  })
  schedule: {
    day: string;
    open: boolean;
    start: string;
    finish: string;
    twentyFourHours: boolean;
  }[];

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, default: 0 })
  reviews: number;

  @Prop({ required: true, default: false })
  approved: boolean;

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

  @Prop({
    type: [
      {
        number: Number,
        internationalCode: String,
        socialMedia: [{ name: String, theres: Boolean, logo: String }],
      },
    ],
  })
  phoneNumber: {
    number: number;
    internationalCode: string;
    socialMedia: {
      name: string;
      theres: boolean;
      logo: string;
    }[];
  }[];
}

export const EstablishmentSchema = SchemaFactory.createForClass(Establishment);

export type EstablishmentDocument = Establishment & Document;

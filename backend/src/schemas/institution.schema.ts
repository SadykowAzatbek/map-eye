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
  description: string;

  @Prop({
    type: Array,
    required: true,
    default: [
      {
        day: 'Понедельник',
        open: true,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Вторник',
        open: true,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Среда',
        open: true,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Четверг',
        open: true,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Пятница',
        open: true,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Суббота',
        open: false,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Воскресенье',
        open: false,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
        twentyFourHours: false,
      },
      {
        day: 'Перерыв',
        open: false,
        start: '2024-09-09T18:00:00.000Z',
        finish: '2024-09-09T18:00:00.000Z',
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

export const InstitutionSchema = SchemaFactory.createForClass(Institution);

export type InstitutionDocument = Institution & Document;

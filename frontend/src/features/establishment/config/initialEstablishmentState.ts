import { EstablishmentForm } from '../../../types/types.Establishments';
import dayjs from 'dayjs';
import { defaultSocialMedia } from './socialMedia.ts';

export const initialEstablishmentState: EstablishmentForm = {
  name: '',
  description: '',
  breakTime: {
    break: false,
    start: dayjs('00:00', 'HH:mm'),
    finish: dayjs('00:00', 'HH:mm'),
  },
  schedule: [
    { day: 'Пн', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Вт', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Ср', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Чт', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Пт', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Сб', open: false, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Вс', open: false, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
  ],
  address: '',
  coordinates: [0, 0],
  phoneNumber: [
    {
      id: Date.now(),
      number: '',
      internationalCode: '',
      isValidPhone: false,
      socialOpen: false,
      socialMedia: defaultSocialMedia,
    },
  ],
};

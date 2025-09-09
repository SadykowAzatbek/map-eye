import { EstablishmentForm } from '../../../types/types.Establishments';
import dayjs from 'dayjs';
import { defaultSocialMedia } from './socialMedia.ts';

export const initialEstablishmentState: EstablishmentForm = {
  name: '',
  description: '',
  schedule: [
    { day: 'Понедельник', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Вторник', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Среда', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Четверг', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Пятница', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Суббота', open: false, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Воскресенье', open: false, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
    { day: 'Перерыв', open: false, start: dayjs('12:30', 'HH:mm'), finish: dayjs('13:30', 'HH:mm'), twentyFourHours: false },
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

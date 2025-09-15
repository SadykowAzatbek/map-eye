import dayjs from 'dayjs';

export interface WorkSchedule {
  day: string;
  open: boolean;
  start: dayjs.Dayjs;
  finish: dayjs.Dayjs;
  twentyFourHours: boolean;
}

interface SocialMediaTypes {
  name: string;
  theres: boolean;
  logo: string;
}


export interface PhoneTypes {
  number: string;
  internationalCode: string;
  socialMedia: SocialMediaTypes[];
}

export interface PhoneMethod extends PhoneTypes {
  id: number;
  isValidPhone: boolean;
  socialOpen: boolean;
}

export interface EstablishmentForm {
  name: string;
  description: string;
  address: string;
  coordinates: [number, number];
  schedule: WorkSchedule[];
  phoneNumber: PhoneMethod[];
}

export interface EstablishmentApi {
  _id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  coordinates: [number, number];
  rating: number;
  approved: boolean;
  schedule: WorkSchedule[];
  phoneNumber: PhoneTypes[];
}

export interface searchTable {
  displayName: string;
  lat: string;
  lon: string;
}

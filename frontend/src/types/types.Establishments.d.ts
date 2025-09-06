import dayjs from 'dayjs';

export interface EstablishmentBase {
  name: string;
  description: string;
  address: string;
  coordinates: [number, number];
}

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


export interface Phone {
  number: string;
  internationalCode: string;
  socialMedia: SocialMediaTypes[];
}

export interface EstablishmentForm {
  name: string;
  description: string;
  address: string;
  coordinates: [number, number];
  schedule: WorkSchedule[];
  phoneNumber: (Phone & {
    id: number;
    phoneError: boolean;
    socialOpen: boolean;
  })[];
}

export interface EstablishmentApi {
  _id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  coordinates: [number, number];
  schedule: WorkSchedule[];
  phoneNumber: Phone[];
}

export interface searchTable {
  displayName: string;
  lat: string;
  lon: string;
}

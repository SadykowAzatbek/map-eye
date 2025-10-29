export class CreateEstablishmentDto {
  name: string;
  description: string;
  breakTime: {
    break: boolean;
    start: string;
    finish: string;
  };
  schedule: {
    day: string;
    open: boolean;
    start: string;
    finish: string;
    twentyFourHours: boolean;
  }[];
  rating: number;
  reviews: number;
  approved: boolean;
  address: string;
  coordinates: [number, number];
  phoneNumber: {
    number: number;
    internationalCode: string;
  }[];
}

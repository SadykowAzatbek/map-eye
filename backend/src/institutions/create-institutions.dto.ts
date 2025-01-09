export class CreateInstitutionsDto {
  name: string;
  description: string;
  schedule: {
    day: string;
    open: boolean;
    start: string;
    finish: string;
    twentyFourHours: boolean;
  }[];
  rating: number;
  approved: boolean;
  address: string;
  coordinates: [number, number];
  phoneNumber: {
    number: number;
    internationalCode: string;
  }[];
}

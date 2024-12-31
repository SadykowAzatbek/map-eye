export class CreateInstitutionsDto {
  name: string;
  description: string;
  schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  rating: number;
  approved: boolean;
  workingHours: {
    start: number;
    finish: number;
  };
  address: string;
  coordinates: [number, number];
  phoneNumber: {
    number: number;
    internationalCode: string;
  }[];
}

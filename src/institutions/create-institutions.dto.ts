export class CreateInstitutionsDto {
  name: string;
  image: string;
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
}

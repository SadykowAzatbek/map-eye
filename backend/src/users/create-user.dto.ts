export class CreateUserDto {
  email: string;
  password: string;
  displayName: string;
  role: string;
  image: string;
}

export class UpdateUserDto {
  email: string;
  displayName: string;
  image: string;
  token: string;
}

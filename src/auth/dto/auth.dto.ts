import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class AuthResgiter {
  // @IsNotEmpty()
  // @IsEmail()
  email: string;
  // @IsNotEmpty()
  fullname: string;
  username: string;
  // @IsNotEmpty()
  // @Length(8)
  password: string;
}

export class AuthLogin {
  email: string;
  password: string;
}

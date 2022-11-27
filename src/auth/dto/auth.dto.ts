import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class AuthResgiter {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  fullname: string;
  username: string;
  @IsNotEmpty()
  @Length(8)
  password: string;
}

export class AuthLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

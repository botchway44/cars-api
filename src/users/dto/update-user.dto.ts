import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';


export class UpdateUserDTO {

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;
}
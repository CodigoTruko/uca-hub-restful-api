import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    carnet: string;
    @IsNotEmpty()
    username: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
}
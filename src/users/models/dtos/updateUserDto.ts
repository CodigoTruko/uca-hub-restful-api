import { IsNotEmpty } from "class-validator";

export class updateUserDto{
    //Object Id
    
    id;
    //String
    @IsNotEmpty()
    name;
    //String
    @IsNotEmpty()
    carnet;
    //String
    @IsNotEmpty()
    username;
    //String
    @IsNotEmpty()
    email;
    //String
    @IsNotEmpty()
    program;
    //String
    @IsNotEmpty()
    description;
    //String
    @IsNotEmpty()
    image;
}
import { IsMongoId, IsNotEmpty, IsObject } from "class-validator";
import { Types } from "mongoose";

export class CreateProgramDto{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsMongoId()
    facultyId: Types.ObjectId;
}
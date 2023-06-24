import { IsNotEmpty } from "class-validator";

export class UpdateProgramDto {
    @IsNotEmpty()
    name;
    @IsNotEmpty()
    facultyId;
}
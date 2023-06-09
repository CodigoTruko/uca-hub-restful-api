import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto{
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    name: string;
    eventId: string;
}
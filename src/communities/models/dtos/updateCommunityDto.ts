import { IsNotEmpty } from "class-validator";

export class UpdateCommunityDto{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    image: string;
    @IsNotEmpty()
    privacy: string;
    visibility: boolean;
}
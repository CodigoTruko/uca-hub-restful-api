import { ApiBody } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";

export class CreateCommunityDto {
    // TODO: Add validation
    // check for empty string OR Validate Client Side
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    image: string;
    @IsNotEmpty()
    privacy: string;
    @IsNotEmpty()
    visibility: boolean;
}
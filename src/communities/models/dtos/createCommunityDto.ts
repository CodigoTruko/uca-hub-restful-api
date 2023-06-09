import { ApiBody } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";

export class CreateCommunityDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    creator;
    image: string;
    privacy: string;
    visibility: boolean;
}
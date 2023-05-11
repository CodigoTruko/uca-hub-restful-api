import { ApiBody } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";

export class CreateEventDto {
    // TODO: Add validation
    // check for empty string OR Validate Client Side
    // Check f
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    category: string;
}
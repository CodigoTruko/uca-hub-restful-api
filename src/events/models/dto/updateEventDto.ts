import { IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";

export class UpdateEventDto {
    // TODO: Add validation
    // check for empty string OR Validate Client Side
    // Check for whitespace
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    category: string;
    visibility: boolean;
}
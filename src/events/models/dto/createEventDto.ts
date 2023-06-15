import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";

export class CreateEventDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
}
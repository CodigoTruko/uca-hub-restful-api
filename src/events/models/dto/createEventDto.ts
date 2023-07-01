import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";
import { Types } from "mongoose";

export class CreateEventDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
    author: Types.ObjectId;
}
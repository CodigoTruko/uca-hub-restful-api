import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID, Length, isNotEmpty} from "class-validator";

export class UpdateEventDto {
    @ApiProperty({
        description: 'This field will contain the new title for the event'
    })
    @IsNotEmpty()
    title: string;
    @ApiProperty({
        description: 'This field will contain the new description for the event'
    })
    @IsNotEmpty()
    description: string;
    @ApiProperty({
        description: 'This field will contain the new category for the event'
    })
    @IsNotEmpty()
    category: string;
    @ApiProperty({
        description: 'This field will contain the new visibility for the event',
        default: true
    })
    visibility: boolean;
}
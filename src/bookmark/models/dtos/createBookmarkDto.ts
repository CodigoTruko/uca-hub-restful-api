import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateBookmarkDto{
    @IsNotEmpty()
    @IsMongoId()
    user: Types.ObjectId
    @IsNotEmpty()
    @IsMongoId()
    event: Types.ObjectId
}
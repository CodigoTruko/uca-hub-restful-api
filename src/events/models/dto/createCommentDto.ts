import { IsNotEmpty } from "class-validator";

export class CreateCommentDto{
    @IsNotEmpty()
    message: string;
    author;
}
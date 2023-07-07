import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/models/entities/user.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment{
    @Prop()
    message: String;
    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]})
    author: User
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

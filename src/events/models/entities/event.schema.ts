import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/models/entities/user.schema";
import { Comment } from "./comment.schema";

export type EventDocument = HydratedDocument<Event>;

@Schema({timestamps: true})
export class Event {
    @Prop({required: true})
    title: string;
    @Prop()
    description: string;
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId,  ref: "User"}]})
    author: User
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId,  ref: "User"}]})
    likes: User[]
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]})
    comments: Comment[]
    @Prop({ default: true})
    visibility: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event)

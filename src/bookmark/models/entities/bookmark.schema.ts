import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Event } from "src/events/models/entities/event.schema";
import { User } from "src/users/models/entities/user.schema";

export type BookmarkDocument = HydratedDocument<Bookmark>

@Schema({timestamps: true})
export class Bookmark{
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]})
    event: Event
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    user: User
}

export const BookmarkSchema =  SchemaFactory.createForClass(Bookmark)

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../../../users/models/entities/user.schema";

export type CommunityDocument = HydratedDocument<Community>;

@Schema({timestamps: true})
export class Community {
    @Prop({required: true})
    name: string;
    @Prop()
    description: string;
    @Prop({default: null})
    image: string;
    @Prop({default: "public"})
    privacy: string;
    @Prop({ default: true })
    visibility: boolean;
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]})
    posts: Event[];
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}]})
    subs: User[];
}

export const CommunitySchema =  SchemaFactory.createForClass(Community);
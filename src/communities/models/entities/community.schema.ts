import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

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
}

export const CommunitySchema =  SchemaFactory.createForClass(Community);
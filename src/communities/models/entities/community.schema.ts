import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
}

export const CommunitySchema =  SchemaFactory.createForClass(Community);
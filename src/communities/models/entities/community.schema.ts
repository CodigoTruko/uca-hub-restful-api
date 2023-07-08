import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../../../users/models/entities/user.schema";

export type CommunityDocument = HydratedDocument<Community>;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
      },
})
export class Community {
    @Prop({required: true})
    name: string;
    @Prop()
    description: string;
    @Prop({default: "No image"})
    image: string;
    @Prop({default: "public"})
    privacy: string;
    @Prop({ default: true })
    visibility: boolean;
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]})
    posts: Event[];
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}]})
    subs: User[];
    postsCount;
}

const CommunitySchema =  SchemaFactory.createForClass(Community);
CommunitySchema.virtual("postsCount")
    .get(function(this: CommunityDocument){
        return this.posts.length;
})

export { CommunitySchema };
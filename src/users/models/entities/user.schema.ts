import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, VirtualType } from "mongoose";
import { Community } from "../../../communities/models/entities/community.schema";
import { Event } from "../../../events/models/entities/event.schema";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Logger } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Program } from "src/programs/models/entities/program.schema";

export type UserDocument = HydratedDocument<User>


@Schema({ 
    timestamps: true,
 })
export class User {
    @ApiProperty()
    @Prop({required: true})
    name: String;
    @ApiProperty()
    @Prop({required: true})
    carnet: String;
    @ApiProperty()
    @Prop({required: true})
    username: String;
    @ApiProperty()
    @Prop({required: true})
    email: String;
    @ApiProperty()
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }]})
    program: Program;
    @ApiProperty()
    @Prop()
    description: String;
    @ApiProperty()
    image: String;
    @ApiProperty()
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]})
    follows: User[];
    @ApiProperty()
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]})
    followers: User[];
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event"}]})
    bookmarks: Event[];
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Community"}]})
    subscriptions: Community[];
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event"}]})
    posts: Event[]
    @ApiProperty()
    @Prop()
    password: String;
    @Prop()
    salt: String;
    @Prop()
    tokens: String[];
    //methods or virtuals
    postsCount;
    genSalt;
    hash;
    compare;
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual("postsCount")
    .get(function(this: UserDocument){
        return this.posts.length;
    });

UserSchema.virtual("genSalt")
    .get(async function(this: UserDocument){
        return await bcrypt.genSalt()
    });

UserSchema.virtual("hash")
    .set(function(password){
        const hash = bcrypt.hashSync(password, this.salt)
        this.set({
            password: hash
        })
});

UserSchema.virtual("compare")
    .get(async function(this: UserDocument, password){
        return await bcrypt.compare(password, this.password)
});

export { UserSchema };
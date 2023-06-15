import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export class User {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    carnet: string;
    @Prop({required: true})
    username: string;
    @Prop({required: true})
    email: string;
    @Prop({required: true})
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User)
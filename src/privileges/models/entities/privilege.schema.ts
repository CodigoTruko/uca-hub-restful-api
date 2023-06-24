import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose";
import { User } from "../../../users/models/entities/user.schema";

export type PrivilegeDocument = HydratedDocument<Event>;

@Schema()
export class Privilege {
    @Prop({required: true})
    name: string;
    @Prop()
    user: User;
}

export const PrivilegeSchema = SchemaFactory.createForClass(Privilege)
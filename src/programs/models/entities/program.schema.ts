import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Faculty } from "src/faculties/models/entities/faculty.schema";

export type ProgramDocument = HydratedDocument<Program>;


@Schema({timestamps: true})
export class Program{
    @Prop({required: true})
    name: string;
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'}]})
    faculty: Faculty;
}

export const ProgramSchema = SchemaFactory.createForClass(Program)
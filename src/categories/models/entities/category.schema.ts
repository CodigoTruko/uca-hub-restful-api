import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { Event } from "src/events/models/entities/event.schema";

export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category{
    @Prop({required: true})
    name: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    event: Event;
}

export const  CategorySchema = SchemaFactory.createForClass(Category)
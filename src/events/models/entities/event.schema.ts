import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose";

export type EventDocument = HydratedDocument<Event>;

@Schema({timestamps: true})
export class Event {
    @Prop({required: true})
    title: string;
    @Prop()
    description: string;
    @Prop({ default: true})
    visibility: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event)

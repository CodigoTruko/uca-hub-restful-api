import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./models/entities/event.schema";
import { UserSchema } from "src/users/models/entities/user.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{name: "Event", schema: EventSchema}]),
        MongooseModule.forFeature([{name: "User", schema: UserSchema}])
    ],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService]
})
export class EventModule{}
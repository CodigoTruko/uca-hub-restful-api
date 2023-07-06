import { Module } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityController } from "./communnity.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Community, CommunitySchema } from "./models/entities/community.schema";
import { EventService } from "src/events/event.service";
import { EventSchema } from "src/events/models/entities/event.schema";
import { User, UserSchema } from "src/users/models/entities/user.schema";
import { UserService } from "src/users/user.service";

@Module(
    {
        imports: [
            MongooseModule.forFeature([{name: Community.name, schema: CommunitySchema}]),
            MongooseModule.forFeature([{name: Event.name, schema: EventSchema}]),
            MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
        ],
        controllers: [CommunityController],
        providers: [CommunityService, EventService, UserService],
        exports: [CommunityService]
    }
)
export class CommunityModule {}
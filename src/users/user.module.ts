import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { User, UserSchema } from "./models/entities/user.schema";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CommunityModule } from "src/communities/community.module";
import { Community, CommunitySchema } from "src/communities/models/entities/community.schema";
import { CommunityService } from "src/communities/community.service";
import { Program, ProgramSchema } from "src/programs/models/entities/program.schema";
import { Faculty, FacultySchema } from "src/faculties/models/entities/faculty.schema";
import { EventService } from "src/events/event.service";
import { Event, EventSchema } from "src/events/models/entities/event.schema";
import { Comment, CommentSchema } from "src/events/models/entities/comment.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema}]),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema}]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema}]),
        MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema}]),
        MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema}])
    ],
    controllers: [UserController],
    providers: [UserService, CommunityService, EventService],
    exports: [UserService]
})
export class UserModule {}
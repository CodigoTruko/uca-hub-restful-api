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

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema}]),
        MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema}]),
        MongooseModule.forFeature([{name: Faculty.name, schema: FacultySchema}])
    ],
    controllers: [UserController],
    providers: [UserService, CommunityService],
    exports: [UserService]
})
export class UserModule {}
import { Module } from "@nestjs/common";
import { EventModule } from "./events/event.module";
import { CommunityModule } from "./communities/community.module";
import { CategoryModule } from "./categories/category.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ProgramModule } from "./programs/program.module";
import { FacultyModule } from "./faculties/faculty.module";


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:6152/uca-hub'),
    EventModule,
    CommunityModule,
    CategoryModule,
    ProgramModule,
    FacultyModule
  ],
})
export class AppModule {}
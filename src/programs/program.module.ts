import {Module} from "@nestjs/common";
import { ProgramController } from "./program.controller";
import { ProgramService } from "./program.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Program, ProgramSchema } from "./models/entities/program.schema";
import { FacultyModule } from "src/faculties/faculty.module";
import { Faculty, FacultySchema } from "src/faculties/models/entities/faculty.schema";
@Module({
    imports: [
        MongooseModule.forFeature([{name: Program.name, schema: ProgramSchema}]),
        MongooseModule.forFeature([{name: Faculty.name, schema: FacultySchema}]),
        FacultyModule
    ],
    controllers: [ProgramController],
    providers: [ProgramService]
})
export class ProgramModule {}
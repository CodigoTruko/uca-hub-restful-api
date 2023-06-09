import { Module } from "@nestjs/common";
import { FacultyService } from "./faculty.service";
import { FacultyController } from "./faculty.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Faculty, FacultySchema } from "./models/entities/faculty.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: Faculty.name, schema: FacultySchema}])],
    controllers: [FacultyController],
    providers: [FacultyService],
})
export class FacultyModule{}
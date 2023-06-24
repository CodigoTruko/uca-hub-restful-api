import { Logger } from "@nestjs/common";

import { CreateFacultyDto } from "./models/dtos/createFacultyDto";
import { InjectModel } from "@nestjs/mongoose";
import { Faculty } from "./models/entities/faculty.schema";
import { Model } from "mongoose";

export class FacultyService{
    private readonly logger = new Logger(FacultyService.name);
    constructor(@InjectModel(Faculty.name) private facultyModel: Model<Faculty>) {}

    async createFaculty(createFacultyDto: CreateFacultyDto){
        const createFaculty = new this.facultyModel(createFacultyDto);
        return await createFaculty.save();
    }
    
    async findAllFaculties(){
        return await this.facultyModel.find().exec();
    }
    
    async findFacultyById(id: string){
    }

    async deleteFaculty(id: string){
        return await this.facultyModel.findByIdAndDelete(id);
    }
}
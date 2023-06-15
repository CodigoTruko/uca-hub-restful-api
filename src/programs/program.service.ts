import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Program } from "./models/entities/program.schema";
import { Model, Types } from "mongoose";
import { CreateProgramDto } from "./models/dtos/createProgramDto";
import { Faculty } from "src/faculties/models/entities/faculty.schema";

@Injectable()
export class ProgramService {
    private readonly logger = new Logger(ProgramService.name);
    constructor(
        @InjectModel(Program.name) private programModel: Model<Program>,
        @InjectModel(Faculty.name) private facultyModel: Model<Faculty>
        ) {}

    async createProgram(createProgramDto: CreateProgramDto) {
        const createdProgram = new this.programModel({
            name: createProgramDto.name  
        });
        const facultyToAdd = await this.facultyModel.findById(createProgramDto.facultyId);
        createdProgram.faculty =  facultyToAdd;
        return await createdProgram.save();
    }

    async findAllPrograms() {
        const programs = await this.programModel.find().exec();
        return programs;
    }

    async findProgramById(id: string) {
        return await this.programModel.findById(id).exec();
    }
    
    async findProgramByKeyword(keyword: string) {
        return await this.programModel.find({name: {$regex: keyword, $options: 'i'}}).exec();
    }

    async deleteProgram(id: string){
        await this.programModel.findByIdAndDelete(id).exec();
    }
}
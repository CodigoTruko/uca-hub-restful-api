import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Res } from "@nestjs/common";
import { CreateProgramDto } from "./models/dtos/createProgramDto";
import { UpdateProgramDto } from "./models/dtos/updateProgramDto";
import { ProgramService } from "./program.service";
import { ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";

@ApiTags('Program')
@Controller('program')
export class ProgramController {
    private readonly logger = new Logger(ProgramController.name);
    constructor(private programService: ProgramService){}

    @Post()
    async createProgram(@Res() res, @Body() createProgramDto: CreateProgramDto) {
        try {
            this.logger.verbose('Creating Program...');
            const program = await this.programService.createProgram(createProgramDto);
            this.logger.verbose('Program Created!');
            this.logger.debug(program)
            return res.status(201).json({message: 'Program created!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
    
    @Get()
    async findAllPrograms(@Res() res) {
        try {
            this.logger.verbose('Finding All Programs...');
            const programs = await this.programService.findAllPrograms();
            
            if(!programs) return res.status(404).json({message: 'Programs not found'});

            this.logger.verbose('Programs Found!');
            return res.status(200).json(programs);
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Delete(':id')
    async deleteProgram(@Res() res, @Param('id') id: string) {
        try {
            this.logger.verbose('Deleting Program...');
            await this.programService.deleteProgram(id);
            this.logger.verbose('Program Deleted!');
            return res.status(200).json({message: 'Program deleted!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
    @Patch()
    updateProgram(@Res() res, @Body() updateProgramDto: UpdateProgramDto) {

    }
}
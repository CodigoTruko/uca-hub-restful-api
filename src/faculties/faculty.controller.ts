import { Body, Controller, Delete, Get, Logger, Param, Post, Res } from "@nestjs/common";
import { FacultyService } from "./faculty.service";
import { CreateFacultyDto } from "./models/dtos/createFacultyDto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Faculty")
@Controller("faculty")
export class FacultyController{
    private readonly logger = new Logger(FacultyController.name);
    constructor(private facultyService: FacultyService){}

    @Post()
    createFaculty(@Res() res, @Body() createFacultyDto: CreateFacultyDto){
        try {
            const FacultyCreated = this.facultyService.createFaculty(createFacultyDto);

            return res.status(200).json({message: 'Faculty created!'})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal Server Error!'})
        }
    }

    @Get()
    async findAllFaculties(@Res() res){
        try {
            this.logger.verbose('Finding All Faculties...');
            const faculties = await this.facultyService.findAllFaculties();

            if(!faculties){
                return res.status(404).json({message:"Faculties not found!"});
            }

            this.logger.verbose('Faculties Found!');
            return res.status(200).json(faculties);
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal Server Error!'})
        }
    }

    @Get(':id')
    findFacultyById(@Res() res, @Param('id') id:string){
        try {
            const facultyFound = this.facultyService.findFacultyById(id);

            if(!facultyFound){
                return res.status(404).json({message:"Faculty not found!"});
            }

            return res.status(200).json(facultyFound);
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal Server Error!'})
        }
    }

    @Delete(':id')
    async deleteFaculty(@Res() res, @Param('id') id: string){
        try {
            this.facultyService.deleteFaculty(id);
            return res.status(200).json({message: 'Faculty Deleted'})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal Server Error!'})
        }

    }
    
}
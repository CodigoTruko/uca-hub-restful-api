import { Body, Controller, Get, Logger, Post, Res } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./models/dtos/createCategoryDto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
    private readonly logger = new Logger(CategoryController.name);
    constructor(private readonly categoryService: CategoryService) {}
    
    @Post()
    createCategory(@Res() res, @Body() createCategoryDto: CreateCategoryDto){
        try {
            
            this.categoryService.createCategory(createCategoryDto);

            return res.status(201).json({message: 'Category created!'});

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }

    @Get()
    findAllCategories(@Res() res){
        try {
            
            const categories = this.categoryService.findAllCategories();

            if(!categories){
                return res.status(404).json({message:"Categories not found!"})
            }

            return res.status(200).json(categories);

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }

    @Get(':id')
    findCategoryById(@Res() res, @Body() id: string){
        try {
            
            const category = this.categoryService.findCategoryById(id);

            if(!category){
                return res.status(404).json({message:"Category not found!"})
            }

            return res.status(200).json(category);

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }

    
}
import { Injectable, Logger } from "@nestjs/common";
import { Category } from "./models/entities/category.interface";
import { CreateCategoryDto } from "./models/dtos/createCategoryDto";

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);
    private readonly categories: Category[] = [
        {
            id: "1",
            name: "Advertisement",
            eventId: "1",
        },
        {
            id: "2",
            name: "Announcement",
            eventId: "2",
        },
    ];

    createCategory(createCategoryDto: CreateCategoryDto){
        const {id, name, eventId} = createCategoryDto;
        const categoryToAdd: Category = {
            id: id,
            name: name,
            eventId: eventId,
        }
        this.logger.debug(categoryToAdd);
        this.categories.push(categoryToAdd);
    }

    findAllCategories(): Category[]{
        this.logger.debug(this.categories);
        return this.categories;
    }

    findCategoryById(id: string): Category{
        const categoryFound = this.categories.find(_category => _category.id === id)
        this.logger.debug(categoryFound);
        return categoryFound;
    }

    deleteCategoryById(id: string){
        const filteredCategories = this.categories.filter(_category => _category.id !== id);

        this.logger.debug(filteredCategories);
    }
}
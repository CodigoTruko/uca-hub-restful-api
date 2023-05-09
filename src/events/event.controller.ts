import { Controller, Get, Post } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Event')
@Controller('event')

export class EventController {
    
    @Get()
    @ApiOkResponse({ description: 'Events found!' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    findAllEvents(){
        return 'All Events';
    }
    
    @Get(':id')
    @ApiOkResponse({ description: 'Event found!' })
    @ApiNotFoundResponse({ description: 'Event not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    findEventById(){
        return 'Event with id';
    }

    @Post()
    @ApiOkResponse({ description: 'Success' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    createEvent(){
        return 'Event Created';
    }
}
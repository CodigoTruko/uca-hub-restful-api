import { Body, Controller, Get, Param, Patch, Post, Req, Res} from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';
@ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private eventService: EventService){}

    @Post()
    @ApiCreatedResponse({ description: 'Event created!' })
    @ApiConflictResponse({ description: 'There is an error while creating your event. Try again later :)' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    createEvent(@Body() createEventDto: CreateEventDto, @Res() res){
        try {

            const eventToAdd = this.eventService.createEvent(createEventDto);

            if (!eventToAdd) {
                return res.status(409).json({message: 'There is an error while creating your event. Try again later :)'});
            }
            
            return res.status(201).json(eventToAdd);
        } catch (error) {
            console.log(error);
        }
    }

    @Get()
    @ApiOkResponse({ description: 'Events found!' })
    @ApiNotFoundResponse({ description: 'Events not found' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    findAllEvents(@Res() res){
        try {
            const events = this.eventService.findAllEvents()
            
            if(!events) return res.status(404).json({message: 'Events not found'});

            return res.status(200).json(events);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Event found!' })
    @ApiNotFoundResponse({ description: 'Event not found' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    findEventById(@Param('id') id: string, @Res() res){

        try {
            const eventToAdd = this.eventService.findEventById(id);

            if(!eventToAdd) return res.status(404).json({message: 'There is no event with such Id!'});

            return res.status(200).json(eventToAdd);

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }
    
    @Patch(":id")
    toggleEventVisibility(@Param('id') id: string, @Res() res){
        try {
            const eventToToggle = this.eventService.findEventById(id);

            if(!eventToToggle) return res.status(404).json({message: 'There is no event with such Id!'});

            const toggledEvent = this.eventService.toggleEventVisibility(id);

            if(!toggledEvent) return res.status(409).json({message: 'There is an error while updating your event. Try again later :)'})

            return res.status(200).json(toggledEvent);

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    @Patch(":id")
    updateEvent(@Param('id') id, @Body() updateEventDto: UpdateEventDto, @Res() res){
        try {
            const eventToUpdate = this.eventService.findEventById(id);

            if (!eventToUpdate) return res.status(404).json({message: 'There is no event with such Id!'});

            const updatedEvent = this.eventService.updateEvent(id, updateEventDto);

            if(!updatedEvent) return res.status(409).json({message: 'There is an error while updating your event. Try again later :)'});

            return res.status(200).json(updatedEvent);

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }
}
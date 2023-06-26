import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, Request, Response, UseGuards} from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';
import { PaginationParams } from 'src/pagination/pagination.model';


@ApiTags('Event')
@Controller('event')
export class EventController {
    private readonly logger = new Logger(EventController.name);
    constructor(private eventService: EventService){}
    

    @Post()
    @ApiCreatedResponse({ description: 'Event created!' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    async createEvent(@Request() req, @Response() res, @Query() {}, @Body() createEventDto: CreateEventDto){
        try {
            this.logger.verbose('Creating Event...');
            await this.eventService.createEvent(createEventDto);
            this.logger.verbose('Event Created!');
            
            return res.status(201).json({message: 'Event created!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }
    
    @Get('/v2')
    async findEvents(@Request() req, @Response() res, @Query() { skip, limit}: PaginationParams){
        try {
            const events =  await this.eventService.findAllVisibleEvents(skip, limit)
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    async findFollowingEvents(){

    }

    async findEventsFromCommunity(){

    }

    @Get()
    @ApiOkResponse({ description: 'Events found!' })
    @ApiNotFoundResponse({ description: 'Events not found' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    async findAllEvents(@Response() res){
        try {
            this.logger.verbose('Finding all events...');
            const events = await this.eventService.findAllEvents()
            
            if(!events) return res.status(404).json({message: 'Events not found'});
            
            this.logger.verbose('Events found!')
            return res.status(200).json(events);
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Event found!' })
    @ApiNotFoundResponse({ description: 'Event not found' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    findEventById(@Param('id') id: string, @Response() res){

        try {
            const eventToAdd = this.eventService.findEventById(id);

            if(!eventToAdd) return res.status(404).json({message: 'There is no event with such Id!'});

            return res.status(200).json(eventToAdd);

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }
    
    @Patch(":id")
    toggleEventVisibility(@Param('id') id: string, @Response() res){
        try {
            const eventToToggle = this.eventService.findEventById(id);

            if(!eventToToggle) return res.status(404).json({message: 'There is no event with such Id!'});

            return res.status(200).json({message: 'Event visibility toggled!'});

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    @Patch(":id")
    updateEvent(@Param('id') id, @Body() updateEventDto: UpdateEventDto, @Response() res){
        try {
            const eventToUpdate = this.eventService.findEventById(id);

            if (!eventToUpdate) return res.status(404).json({message: 'There is no event with such Id!'});

            const updatedEvent = this.eventService.updateEvent(id, updateEventDto);

            if(!updatedEvent) return res.status(409).json({message: 'There is an error while updating your event. Try again later :)'});

            return res.status(200).json(updatedEvent);

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    @Delete(":id")
    async deleteEvent(@Param('id') id: string, @Response() res){
        try {
            this.logger.verbose('Deleting event...');
            await this.eventService.deleteEvent(id);
            return res.status(200).json({message: 'Event deleted!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }
}
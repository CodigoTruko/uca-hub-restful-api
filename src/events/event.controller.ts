import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { EventService } from './event.service';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';
import { PaginationParams } from 'src/pagination/paginationParamsDto';
import { AuthGuard } from "../auth/auth.guard";
import { getNext, getPrevious } from 'src/utils/queryUrl.calculator';
import { UserService } from 'src/users/user.service';


@ApiTags('Event')
@Controller('event')
export class EventController {
    private readonly logger = new Logger(EventController.name);
    constructor(
        private eventService: EventService,
        private userService: UserService
    ){}
    

    
    

    @UseGuards(AuthGuard)
    @Post("/profile")
    async createProfileEvent(@Req() req: Request, @Res() res: Response, @Body() event: CreateEventDto,){
        try {
            this.logger.verbose("Creating Profile Event...")
            event.author = req.user["sub"]
            
            await this.eventService.createProfileEvent(event, req.user["sub"]);
            this.logger.verbose("Profile Event Created!");
            return res.status(201).json({ message: "Event Created!" })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }

    //TODO Migrate endpoint to User Controller
    @UseGuards(AuthGuard)
    @Get("/profile")
    async getEventsFromProfile(@Req() req: Request, @Res() res: Response,  @Query() { skip, limit }: PaginationParams){
        try {
            this.logger.verbose("Fetching User's Profile Events...")

            const countAndResults = await this.eventService.getEventsFromProfile(req.user["sub"], skip, limit)

            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, countAndResults.count);
            const previous = getPrevious(fullUrl, skip, limit, countAndResults.count);

            this.logger.verbose("User's Profile Events Fetched!")

            return res.status(200).json({
                count: countAndResults.count,
                next: next,
                previous: previous,
                results: countAndResults.results
            })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({ message: "Oops! Something went wrong. Try again later :)" });
        }
    }

    @UseGuards(AuthGuard)
    @Get("/feed")
    async getFeed(@Req() req: Request, @Res() res: Response, @Query() {skip, limit}: PaginationParams){
        try {
            this.logger.verbose("Fetching User's Feed...");
            const user = req.user;
            const countAndFeed = await this.eventService.getFeed(user["sub"], skip, limit);
            
            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, countAndFeed.count);
            const previous = getPrevious(fullUrl, skip, limit, countAndFeed.count);
            this.logger.verbose("User's Feed fetched!")
            return res.status(200).json({
                count: countAndFeed.count,
                next: next,
                previous: previous,
                results: countAndFeed.results,
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)",
            });
        }
    }

    @Get()
    @ApiOkResponse({ description: 'Events found!' })
    @ApiNotFoundResponse({ description: 'Events not found' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    async findAllEvents(@Req() req: Request, @Res() res: Response, @Query() { skip, limit}: PaginationParams){
        try {
            this.logger.verbose('Finding all events...');
            const events = await this.eventService.findAllEvents()
            
            if(!events) return res.status(404).json({message: 'Events not found'});
            
            this.logger.verbose('Events found!')
            return res.status(200).json(events);
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    async createEvent(@Req() req: Request, @Res() res: Response, @Body() event: CreateEventDto){
        try {
            this.logger.verbose("Creating Profile Event...")
            event.author = req.user["sub"]
            
            await this.eventService.createEvent(event);
            this.logger.verbose("Profile Event Created!");
            return res.status(201).json({ message: "Event Created!" })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Event found!' })
    @ApiNotFoundResponse({ description: 'Event not found' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    findEventById(@Param('id') id: string, @Req() req: Request, @Res() res: Response){
        try {
            const eventToAdd = this.eventService.findEventById(id);

            if(!eventToAdd) return res.status(404).json({message: 'There is no event with such Id!'});

            return res.status(200).json(eventToAdd);

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }
    
    @Patch(":id")
    toggleEventVisibility(@Param('id') id: string, @Req() req: Request, @Res() res: Response){
        try {
            const eventToToggle = this.eventService.findEventById(id);

            if(!eventToToggle) return res.status(404).json({message: 'There is no event with such Id!'});

            return res.status(200).json({message: 'Event visibility toggled!'});

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }

    @Patch(":id")
    updateEvent(@Param('id') id, @Body() updateEventDto: UpdateEventDto, @Req() req: Request, @Res() res: Response){
        try {
            const eventToUpdate = this.eventService.findEventById(id);

            if (!eventToUpdate) return res.status(404).json({message: 'There is no event with such Id!'});

            const updatedEvent = this.eventService.updateEvent(id, updateEventDto);

            if(!updatedEvent) return res.status(409).json({message: 'There is an error while updating your event. Try again later :)'});

            return res.status(200).json(updatedEvent);

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }

    @Delete(":id")
    async deleteEvent(@Param('id') id: string, @Req() req: Request, @Res() res: Response,){
        try {
            this.logger.verbose('Deleting event...');
            await this.eventService.deleteEvent(id);
            return res.status(200).json({message: 'Event deleted!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }
}
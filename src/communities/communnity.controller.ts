import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { CreateCommunityDto } from "./models/dtos/createCommunityDto";
import { CommunityService } from "./community.service";
import { UpdateCommunityDto } from "./models/dtos/updateCommunityDto";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateEventDto } from "src/events/models/dto/createEventDto";
import { getNext, getPrevious } from "src/utils/queryUrl.calculator";
import { EventService } from "src/events/event.service";
import { PaginationParams } from "src/pagination/paginationParamsDto";

@ApiTags('Community')
@Controller('community')
export class CommunityController{
    private readonly logger = new Logger(CommunityController.name);
    constructor(
        private readonly communityService: CommunityService,
        private readonly eventService: EventService,
    ){}

    @Post()
    createCommunity(@Req() req: Request, @Res() res: Response, @Body() createCommunityDto: CreateCommunityDto){
        try {
            this.logger.verbose('Creating Community..')
            this.communityService.createCommunity(createCommunityDto);
            this.logger.verbose('Community created!')
            return res.status(201).json({message: 'Community created!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }

    //TODO Migrate endpoint to community
    @UseGuards(AuthGuard)
    @Post("/post/:name")
    @ApiCreatedResponse({ description: 'Event created!' })
    @ApiInternalServerErrorResponse({ description: 'Oops! Something went wrong. Try again later :)' })
    async createCommunityEvent(@Req() req: Request, @Res() res: Response, @Param("name") name: string, @Body() createEventDto: CreateEventDto){
        try {
            this.logger.verbose('Creating Community Event...');
            createEventDto.author = req.user["sub"];
            await this.eventService.createCommunityEvent(createEventDto, name);
            this.logger.verbose('Community Event Created!');
            
            return res.status(201).json({message: 'Event created!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Oops! Something went wrong. Try again later :)'});
        }
    }

    //TODO Migrate this endpoint to community controller
    @Get("/community/:name")
    async findEventsFromCommunity(@Req() req: Request, @Res() res: Response, @Param("name") name: string, @Query() { skip, limit }: PaginationParams){
        try {
            this.logger.verbose("Fetching Community's Events...");
            const countAndResults = await this.eventService.getEventsFromCommunity(name, skip, limit);
            this.logger.verbose(countAndResults.results.length)

            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, countAndResults.count);
            const previous = getPrevious(fullUrl, skip, limit, countAndResults.count);

            this.logger.verbose("Community's Events fetched!");
            return res.status(200).json({
                count: countAndResults.count,
                next: next,
                previous: previous,
                results: countAndResults.results
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Oops! Something went wrong. Try again later :)"});
        }
    }

    @Get()
    async findAllCommunities(@Req() req: Request, @Res() res: Response){
        try {
            this.logger.verbose('Finding All Communities...');
            const communities = await this.communityService.findAllCommunities();
            this.logger.verbose('Community Created!');
            /* const communitiesFound = this.communityService.findAllCommunities();

            if(!communitiesFound){
                return res.status(404).json({message:"Communities not found!"});
            } */

            return res.status(200).json(communities);
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Delete(':id')
    async deleteCommunity(@Req() req: Request, @Res() res: Response, @Param('id') id: string){
        try {
            this.logger.verbose('Deleting Community...');
            this.communityService.deleteCommunity(id);
            this.logger.verbose('Community Deleted!');
            return res.status(200).json({message: 'Community Deleted!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'}); 
        }
    }
    @Get(':id')
    findEventById(@Req() req: Request, @Res() res: Response, @Param('id') id: string){
        try {
            /* const communityFound = this.communityService.findCommunityById(id);

            if(!communityFound){
                return res.status(404).json({message:"Community not found!"});
            }

            return res.status(200).json(communityFound); */
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Patch(':id')
    toggleCommunityVisibility(@Req() req: Request, @Res() res: Response,  @Param('id') id: string){
        try {
            /* const commmunityToggled = this.communityService.toggleCommunityVisibility(id);

            if(!commmunityToggled){
                return res.status(404).json({message:"Community not found!"});
            }
            return res.status(200).json(commmunityToggled); */
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Patch(':id')
    updateCommunity(@Req() req: Request, @Res() res: Response,  @Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto){
        try {
            /* const communityUpdated = this.communityService.updateCommunity(id,updateCommunityDto);

            if(!communityUpdated){
                return res.status(404).json({message:"Community not found!"});
            }
            return res.status(200).json(communityUpdated); */
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
}
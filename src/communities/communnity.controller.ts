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
import { UserService } from "src/users/user.service";

@ApiTags('Community')
@Controller('community')
export class CommunityController{
    private readonly logger = new Logger(CommunityController.name);
    constructor(
        private readonly communityService: CommunityService,
        private readonly eventService: EventService,
        private readonly userService: UserService,
    ){}

    @UseGuards(AuthGuard)
    @Post()
    async createCommunity(@Req() req: Request, @Res() res: Response, @Body() createCommunityDto: CreateCommunityDto){
        try {
            this.logger.verbose('Creating Community..')

            const communityFound = await this.communityService.findCommunityByName(createCommunityDto.name)

            if(!communityFound) return res.status(200).json({message: "There is already a community with that NAME!"})

            createCommunityDto.creator =  req.user["sub"]
            await this.communityService.createCommunity(createCommunityDto);
            this.logger.verbose('Community created!')
            return res.status(201).json({message: 'Community created!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }

    
    @UseGuards(AuthGuard)
    @Patch("/subscribe/:identifier")
    async subscribeToCommunity(@Req() req: Request, @Res() res: Response, @Param("identifier") identifier: string){
        try {
            console.log(req.originalUrl)
            const toFollow = await this.communityService.findCommunityByName(identifier);
            console.log(toFollow)
            if(!toFollow) return res.status(404).json({ message: "The COMMUNITY you are trying to follow does not exist!"})

            const user = req.user
            const followStatus = await this.userService.followCommunity( user["sub"], toFollow._id);
            this.logger.debug(followStatus)
            return res.status(200).json({ message: "Follow has been toggled"})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Get("/search")
    async findAllCommunities(@Req() req: Request, @Res() res: Response, @Query() {skip=0, limit=20}: PaginationParams, @Query() {keyword}){
        try {
            this.logger.verbose('Finding All Communities...');
            const communities = keyword ? await this.communityService.searchAllCommunities(keyword) : await this.communityService.findAllCommunities();
            
            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, communities.length);
            const previous = getPrevious(fullUrl, skip, limit, communities.length);

            this.logger.verbose('Community Created!');
            return res.status(200).json({
                count: communities.length,
                next: next,
                previous: previous,
                results: communities
            });
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }

    @UseGuards(AuthGuard)
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
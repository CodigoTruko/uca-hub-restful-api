import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateCommunityDto } from "./models/dtos/createCommunityDto";
import { CommunityService } from "./community.service";
import { UpdateCommunityDto } from "./models/dtos/updateCommunityDto";

@ApiTags('Community')
@Controller('community')
export class CommunityController{
    private readonly logger = new Logger(CommunityController.name);
    constructor(private readonly communityService: CommunityService){}

    @Post()
    createCommunity(@Res() res, @Body() createCommunityDto: CreateCommunityDto){
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
    @Get()
    async findAllCommunities(@Res() res){
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
    async deleteCommunity(@Res() res, @Param('id') id: string){
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
    findEventById(@Res() res, @Param('id') id: string){
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
    toggleCommunityVisibility(@Res() res, @Param('id') id: string){
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
    updateCommunity(@Res() res, @Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto){
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
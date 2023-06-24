import { Injectable, Logger } from "@nestjs/common";
import { CreateCommunityDto } from "./models/dtos/createCommunityDto";
import { UpdateCommunityDto } from "./models/dtos/updateCommunityDto";
import { Community } from "./models/entities/community.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CommunityService{
    private readonly logger = new Logger(CommunityService.name);
    constructor(@InjectModel(Community.name) private communityModel: Model<Community>){}      
    
    async createCommunity(createCommunityDto: CreateCommunityDto){
        const createCommunity = new this.communityModel(createCommunityDto);
        this.logger.log(createCommunity);
        return await createCommunity.save();   
    }

    async findAllCommunities(){
        return await this.communityModel.find().exec();
        /* this.logger.debug(this.communities);
        return this.communities; */
    }

    findAllVisibleCommunities(){
        /* const visibleCommunities = this.communities.filter(_community => _community.visibility === true);
        this.logger.debug(visibleCommunities);
        return visibleCommunities; */
    }

    findCommunityById(id: string){
        /* const community = this.communities.find(_community => _community.id === id);
        this.logger.debug(community);
        return community; */
    }
    updateCommunity(id: string, updateCommunityDto: UpdateCommunityDto){
        /* const {name, description, image, privacy} = updateCommunityDto;
        const communityToUpdate = this.findCommunityById(id);
        communityToUpdate.name = name;
        communityToUpdate.description = description;
        communityToUpdate.image = image;
        communityToUpdate.privacy = privacy;
        this.logger.debug(communityToUpdate);
        return communityToUpdate; */
    }
    async deleteCommunity(id: String){
        await this.communityModel.findByIdAndDelete(id);
    }
    toggleCommunityVisibility(id: string){
        /* const communityToToggle = this.findCommunityById(id);
        communityToToggle.visibility = !communityToToggle.visibility;
        this.logger.debug(communityToToggle);
        return communityToToggle; */
    }
}
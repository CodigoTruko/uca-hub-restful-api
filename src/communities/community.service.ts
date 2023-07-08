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

    async searchAllCommunities(keyword, documentsToSkip=0, limitOfDocuments=20){
        const communityResults = await this.communityModel.find({ $or: [
            { name: { $regex: keyword, $options: 'i'}},
            ]}, 
        /* {
            password: 0,
            salt: 0,
            posts: 0,
            subscriptions: 0,
            followers: 0,
            follows: 0,
            createdAt: 0,
            updatedAt: 0,
            tokens: 0,
            bookmarks: 0,
            email: 0,
            __v: 0,
        } */)
        //.select("-password -salt -posts -subscriptions -follows -followers -createdAt -updatedAt -tokens -bookmarks -email -__v")
        .skip(documentsToSkip)
        .limit(limitOfDocuments)
        .sort({ name: 1})
        .exec()

        return communityResults;
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

    async findCommunityByName(community){
        const communityFound = await this.communityModel.findOne({name: community}).exec();
        return communityFound;
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
    async toggleCommunityVisibility(id: string){
        /* const communityToToggle = this.findCommunityById(id);
        communityToToggle.visibility = !communityToToggle.visibility;
        this.logger.debug(communityToToggle);
        return communityToToggle; */
    }
}
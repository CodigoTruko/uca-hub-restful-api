import { Injectable, Logger } from "@nestjs/common";
import { Community } from "./models/interface/community.interface";
import { CreateCommunityDto } from "./models/dtos/createCommunityDto";

@Injectable()
export class CommunityService{
    private readonly logger = new Logger(CommunityService.name);
    private readonly communities: Community[] = [
            {
                id: "1",
                name: "Furbo UCA",
                description: "Puro pinshi Furbo maestro",
                image: "aqui va la imagen",
                privacy: "public",
                visibility: true
            },
            {
                id: "2",
                name: "Pokemon UCA",
                description: "Puro pinshi Pokemon maestro",
                image: "aqui va la imagen",
                privacy: "public",
                visibility: true
            },
            {
                id: "3",
                name: "Loleros UCA",
                description: "Puro pinshi Lol maestro",
                image: "aqui va la imagen",
                privacy: "public",
                visibility: true
            }        
    ]
    createCommunity(createCommunityDto: CreateCommunityDto){
        const {id, name, description, image, privacy,} = createCommunityDto;
        const communityToAdd: Community = {
            id: id,
            name: name,
            description: description,
            image: image,
            privacy: privacy,
            visibility: true
        }

        this.logger.debug(communityToAdd)
        this.communities.push(communityToAdd)        
    }

    findAllCommunities(): Community[]{
        return this.communities;
    }

    findAllVisibleCommunities(): Community[]{
        return this.communities.filter(_community => _community.visibility === true);
    }

    findCommunityById(id: string): Community{
        return this.communities.find(_community => _community.id === id);
    }
    updateCommunity(id: string, updateCommunityDto: CreateCommunityDto){
        const {name, description, image, privacy} = updateCommunityDto;
        const communityToUpdate = this.findCommunityById(id);
        communityToUpdate.name = name;
        communityToUpdate.description = description;
        communityToUpdate.image = image;
        communityToUpdate.privacy = privacy;
    }
    toggleCommunityVisibility(id: string){
        const communityToToggle = this.findCommunityById(id);
        communityToToggle.visibility = !communityToToggle.visibility;
    }
}
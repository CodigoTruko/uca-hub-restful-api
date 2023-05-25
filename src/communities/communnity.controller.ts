import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Community')
@Controller('community')
export class CommunityController{
    createCommunity(){}
    findAllCommunities(){}
    findEventById(){}
    toggleCommunityVisibility(){}
    updateCommunity(){}
}
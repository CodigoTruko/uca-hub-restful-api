import { Module } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityController } from "./communnity.controller";

@Module(
    {
        imports: [],
        controllers: [CommunityController],
        providers: [CommunityService],
    }
)
export class CommunityModule {}
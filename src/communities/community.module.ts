import { Module } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityController } from "./communnity.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Community, CommunitySchema } from "./models/entities/community.schema";

@Module(
    {
        imports: [MongooseModule.forFeature([{name: Community.name, schema: CommunitySchema}])],
        controllers: [CommunityController],
        providers: [CommunityService],
    }
)
export class CommunityModule {}
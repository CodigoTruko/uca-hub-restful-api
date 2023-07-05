import { Body, Controller, Get, Logger, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { RegisterUserDto } from "./models/dtos/registerUserDto";
import { LoginUserDto } from "./models/dtos/loginUserDto";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { CommunityService } from "src/communities/community.service";
import * as bcrypt from "bcrypt";
import { PaginationParams } from "src/pagination/paginationParamsDto";
import { ApiTags } from "@nestjs/swagger";
import { count } from "console";
import { getNext, getPrevious } from "src/utils/queryUrl.calculator";

@ApiTags('User')
@Controller('user')
export class UserController {

    private readonly logger = new Logger(UserController.name);
    constructor(
        private userService: UserService,
        private communityService: CommunityService
    ) {}
    

    //Follow
    @UseGuards(AuthGuard)
    @Patch('/follow/:identifier')
    async followUser(@Req() req: Request, @Res() res: Response, @Param("identifier") identifier: string){
        try {
            console.log(req.originalUrl)
            const toFollow = await this.userService.findUserByIdentifier(identifier);
            console.log(toFollow)
            if(!toFollow) return res.status(404).json({ message: "The USER you are trying to follow does not exist!"})

            const user = req.user
            const followStatus = await this.userService.followUser(toFollow._id, user["sub"]);
            this.logger.debug(followStatus)
            return res.status(200).json({ message: "Follow has been toggled"})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Get("/subscriptions")
    async getSubscriptions(@Req() req: Request, @Res() res: Response){
        try {
            const user =  await this.userService.getMyProfile(req.user["sub"])

            return res.status(200).json({ subcriptions: user.subscriptions})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }

    }


    @UseGuards(AuthGuard)
    @Get("/follows")
    async getFollows(@Req() req: Request, @Res() res: Response){
        try {
            const user =  await this.userService.getMyProfile(req.user["sub"])


            return res.status(200).json({ follows: user.follows})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }

    }

    @UseGuards(AuthGuard)
    @Get("/followers")
    async getFollowers(@Req() req: Request, @Res() res: Response){
        try {
            const user =  await this.userService.getMyProfile(req.user["sub"])

            return res.status(200).json({ followers: user.followers})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }

    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    async findMyUser(@Req() req: Request, @Res() res: Response){
        try {
            const user =  req.user
            const myUser = await this.userService.getMyProfile(user["sub"]);

            const { name, carnet, username, email, followers, follows, posts } = myUser;

            const profile = {
                name: name,
                carnet: carnet,
                username: username,
                email: email,
                followers: followers,
                follows: follows,
                posts: posts
            }
            return res.status(200).json({ profile: profile})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }
    
    
    @UseGuards(AuthGuard)
    @Get('/bookmarks')
    async getUserBookmarks(@Req() req: Request, @Res() res: Response){
        try {
            this.logger.verbose("Fetching Users Bookmarks!");
            const user = await this.userService.getMyProfile(req.user["sub"]);

            this.logger.verbose("Users Bookmarks Fetched!");
            return res.status(200).json({ subscriptions: user.bookmarks})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Patch("/subscribe/:identifier")
    async subscribeToCommunity(@Req() req: Request, @Res() res: Response, @Param("identifier") identifier: string){
        try {
            console.log(req.originalUrl)
            const toFollow = await this.communityService.findCommunityByIdentifier(identifier);
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
    @Get("identifier/:username")
    async findUserByUsername(@Req() req: Request, @Res() res: Response, @Param("username") identifier: string){
        try {
            this.logger.verbose("Finding User...");
            const userFound = await this.userService.findUserByUsername(identifier)

            if(!userFound) return res.status(404).json({ error: "User not found!"})


            const { name, carnet, username, email, follows, followers} = userFound

            const userProfile = {
                name: name,
                carnet: carnet,
                username: username,
                email: email,
                follows: follows,
                followers: followers
            }
            this.logger.verbose("User Found!");
            return res.status(200).json({user: userProfile })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Get("/search")
    async search(@Req() req: Request, @Res() res: Response, @Query() {skip, limit}: PaginationParams, @Query() {keyword}){
        try {
            
            this.logger.verbose("Searching Users...");
            console.log(keyword)
            const countAndResults = await this.userService.searchUsers(keyword, skip, limit);
            
            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, countAndResults.count);
            const previous = getPrevious(fullUrl, skip, limit, countAndResults.count);

            return res.status(200).json({
                count: countAndResults.count,
                next: next,
                previous: previous,
                results: countAndResults.results
            })
        
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Internal server error!"});
        }

    }
}
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
import { updateUserDto } from "./models/dtos/updateUserDto";
import { EventService } from "src/events/event.service";

@ApiTags('User')
@Controller('user')
export class UserController {

    private readonly logger = new Logger(UserController.name);
    constructor(
        private userService: UserService,
        private eventService: EventService,
        private communityService: CommunityService,
    ) {}
    

    //Follow
    @UseGuards(AuthGuard)
    @Patch('/follow/:identifier')
    async followUser(@Req() req: Request, @Res() res: Response, @Param("identifier") identifier: string){
        try {
            const toFollow = await this.userService.findUserByIdentifier(identifier);
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
    @Patch("/bookmark/:identifier")
    async bookmarkEvent(@Req() req: Request, @Res() res: Response, @Param("identifier") event: string){
        try {
            this.logger.verbose("Bookmarking the Event...")
            const eventToBookmark = await this.eventService.findEventById(event);

            const myUser = await this.userService.findUserById(req.user["sub"])

            const query = await this.userService.bookmarkAnEvent(myUser._id, eventToBookmark._id)

            return res.status(200).json({})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Get('/bookmarks')
    async getUserBookmarks(@Req() req: Request, @Res() res: Response, @Query() {skip=0, limit=20}: PaginationParams){
        try {
            this.logger.verbose("Fetching Users Bookmarks!");
            const user = await this.userService.getMyProfile(req.user["sub"]);

            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, user.bookmarks.length);
            const previous = getPrevious(fullUrl, skip, limit, user.bookmarks.length);

            this.logger.verbose("Users Bookmarks Fetched!");
            return res.status(200).json({ 
                count: user.bookmarks.length,
                next: next,
                previous: previous,
                results: user.bookmarks})
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
            const toFollow = await this.communityService.findCommunityByName(identifier);
            console.log(toFollow)
            if(!toFollow) return res.status(404).json({ message: "The COMMUNITY you are trying to follow does not exist!"})

            const user = req.user
            const followStatus = await this.userService.followCommunity( user["sub"], toFollow._id);
            this.logger.debug(followStatus)
            return res.status(200).json({ message: "Follow has been toggled!"})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Get("/subscriptions")
    async getSubscriptions(@Req() req: Request, @Res() res: Response, @Query() {skip = 0, limit=20}: PaginationParams){
        try {
            const user =  await this.userService.getMyProfile(req.user["sub"])

            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, user.bookmarks.length);
            const previous = getPrevious(fullUrl, skip, limit, user.bookmarks.length);

            return res.status(200).json({ 
                count: user.bookmarks.length,
                next: next,
                previous: previous,
                results: user.subscriptions
            })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }

    }


    @UseGuards(AuthGuard)
    @Get("/follows")
    async getFollows(@Req() req: Request, @Res() res: Response, @Query() {skip = 0, limit=20}: PaginationParams){
        try {
            const user =  await this.userService.getUserFollowsAndFollowers(req.user["sub"])
            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, count);
            const previous = getPrevious(fullUrl, skip, limit, count);

            return res.status(200).json({
                count: user.follows.length,
                next: next,
                previous: previous,
                results: user.follows,

            })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }

    }

    @UseGuards(AuthGuard)
    @Get("/followers")
    async getFollowers(@Req() req: Request, @Res() res: Response, @Query() {skip = 0, limit = 20 }: PaginationParams){
        try {
            const user =  await this.userService.getUserFollowsAndFollowers(req.user["sub"])
            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, count);
            const previous = getPrevious(fullUrl, skip, limit, count);

            return res.status(200).json({
                count: user.followers.length,
                next: next,
                previous: previous,
                results: user.followers,

            })

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
            this.logger.verbose("Fetching User's Profile...")
            const user =  req.user
            const myUser = await this.userService.getMyProfile(user["sub"]);

            const profile = {
                id: myUser._id,
                name: myUser.name,
                carnet: myUser.carnet,
                username: myUser.username,
                email: myUser.email,
                program: myUser.program,
                description: myUser.description,
                image: myUser.image,
                followers: myUser.followers.length,
                follows: myUser.follows.length
            }
            this.logger.verbose("User's Profile Fetched...")
            return res.status(200).json({ profile })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @UseGuards(AuthGuard)
    @Get("/search")
    async search(@Req() req: Request, @Res() res: Response, @Query() {skip = 0, limit = 20}: PaginationParams, @Query() {keyword}){
        try {
            
            this.logger.verbose("Searching Users...");
            console.log(keyword)

            // const countAndResults = await this.userService.searchUsers(keyword, skip, limit)
            const countAndResults = keyword ? await this.userService.searchUsers(keyword, skip, limit) : await this.userService.findAllUsers();
            
            const fullUrl = req.protocol + '://' + req.get('host') + req.path;
            const next = getNext(fullUrl, skip, limit, countAndResults.count);
            const previous = getPrevious(fullUrl, skip, limit, countAndResults.count);

            return res.status(200).json({
                count: countAndResults.results.length,
                next: next,
                previous: previous,
                results: countAndResults.results
            })

            return res.status(200).json({message:"simon"})
        
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Internal server error!"});
        }

    }

    @UseGuards(AuthGuard)
    @Get("/identifier/:id")
    async getAllUsers(@Req() req: Request, @Res() res: Response, @Param("id") id){
        try {
            const user = await this.userService.findUserByUsername(id)

            if(!user) return res.status(404).json({message: "The USER you search for was NOT found!"})

            const profile = {
                name: user.name,
                carnet: user.carnet,
                username: user.username,
                email: user.email,
                program: user.program,
                description: user.description,
                image: user.image,
                followers: user.followers.length,
                follows: user.follows.length
            }
            return res.status(200).json({ profile: profile })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({ message: "Internal server error!"})
        }
    }

    @UseGuards(AuthGuard)
    @Patch()
    async updateUser(@Req() req: Request, @Res() res: Response, @Body() updatedUser: updateUserDto){
        try {
            this.logger.verbose("Updating User...")
            updatedUser.id = req.user["sub"]
            const user = await this.userService.updateMyProfile(updatedUser)
            
            this.logger.verbose("User Updated!")
            return res.status(200).json({ message: "User updated succesfully!"})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({ message: "Internal server error!"})
        }
    }
    @UseGuards(AuthGuard)
    @Patch("/photo")
    async updateProfilePic(@Req() req: Request, @Res() res: Response,){
        try {
            this.logger.verbose("Updating Profile Pic...")
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({ message: "Internal server error!"});
        }
    }
}
import { Body, Controller, Get, Logger, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { RegisterUserDto } from "./models/dtos/registerUserDto";
import { LoginUserDto } from "./models/dtos/loginUserDto";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { CommunityService } from "src/communities/community.service";

@Controller('user')
export class UserController {

    private readonly logger = new Logger(UserController.name);
    constructor(
        private userService: UserService,
        private communityService: CommunityService) {}

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
            return res.status(500).json({error: "Internal server error!"})
        }
    }

    @UseGuards(AuthGuard)
    @Get("/subscriptions")
    async getSubscriptions(@Req() req: Request, @Res() res: Response){
        try {
            const user =  await this.userService.getMyProfile(req.user["sub"])

            return res.status(200).json({ followers: user.followers})
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

            return res.status(200).json({ followers: user.follows})
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

            const { name, carnet, username, email, followers, follows } = myUser;

            const profile = {
                name: name,
                carnet: carnet,
                username: username,
                email: email,
                followers: followers,
                follows: follows
            }
            return res.status(200).json({ profile: profile})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }

    @Get('/all')
    async findAllUsers(@Req() req: Request, @Res() res: Response){
        try {
            
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"});
        }
    }
    
    @UseGuards(AuthGuard)
    @Get('/bookmarks')
    getUserBookmarks(@Req() req: Request, @Res() res: Response){
        //TODO
        try {
            this.logger.verbose("Fetching Users Bookmarks!");
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

    @Get(':id')
    findUserByUsername(@Req() req: Request, @Res() res: Response, @Param("id") id: string){
        try {
            
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Internal server error!"});
        }
    }   
}
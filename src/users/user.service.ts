import { Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "./models/dtos/registerUserDto";
import { User, UserDocument } from "./models/entities/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginUserDto } from "./models/dtos/loginUserDto";
import * as bcrypt from "bcrypt";
import { updateUserDto } from "./models/dtos/updateUserDto";
import { Community } from "src/communities/models/entities/community.schema";

@Injectable()
export class UserService {
    private readonly logger =  new Logger(UserService.name)
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Community.name) private communityModel: Model<Community>,
        ) {}

    async createUser(registerUserDto: RegisterUserDto ){
        const userSalt = await bcrypt.genSaltSync();
        registerUserDto.password = await bcrypt.hash(registerUserDto.password, userSalt);
        registerUserDto.salt = userSalt
        const createdUser = await new this.userModel(registerUserDto).save();
        
        this.logger.debug(`User created with id: ${createdUser._id}`);
    }
    async findAllUsers(){
        return await this.userModel.find().exec();
    }
    async findUserByIdentifier(identifier: string){
        const userFound = await this.userModel.findOne({ $or: [{username: identifier}, { email: identifier}] } ).exec();
        return userFound;
    }
    async findUserById(identifier: string): Promise<UserDocument>{
        return await this.userModel.findById(identifier).exec();
    }
    async findUserByUsername(username: string){
        return await this.userModel.findOne({username: username}).exec();
    }
    async findUserByEmail(email: string){
        return await this.userModel.findOne({email: email}).exec();
    }
    async updateProfileByIdentifier(identifier: string, updateUserDto: updateUserDto){
 
    }
    async addTokenToUser(identifier: string, newToken: string){
        const userFound = await this.findUserByIdentifier(identifier);

        const userTokens = userFound.tokens.concat(newToken)
        userFound.tokens = userTokens
    }

    //TODO Follow a User insert into Followers
    // add into others followers and into the user's own follows

    //Works with params being the usernames of the people within the interaction
    async followUser(toFollow, follower){

        const userToFollow = await this.userModel.findOne({ _id: toFollow, followers: { _id: follower } }).exec();
        const userFollowing = await this.userModel.findOne({ _id: follower, follows: { _id: toFollow}}).exec();

        if(!userToFollow || !userFollowing){

            const saveFollow = await this.userModel.updateOne({ _id: toFollow }, { $push: { followers: { _id: follower }}});
            const saveFollower = await this.userModel.updateOne({ _id: follower }, { $push: { follows: { _id: toFollow }}});

            return { saveFollow, saveFollower};

        } else {
            const deleteFollow = await this.userModel.updateOne({ _id: toFollow }, { $pull: { followers: follower }});
            const deleteFollower = await this.userModel.updateOne({ _id: follower }, { $pull: { follows: toFollow}});

            return { deleteFollow, deleteFollower};
        }

        return "last return"
    }

    async followCommunity(user, community){
        const communityToFollow = await this.communityModel.findOne({ _id: community, subs: { _id: user } }).exec();
        const userFollowing = await this.userModel.findOne({ _id: user, subscriptions: { _id: community }}).exec();

        if(!communityToFollow || !userFollowing){

            const saveCommunity = await this.communityModel.updateOne({ _id: community }, { $push: { subs: { _id: user }}});
            const saveUser = await this.userModel.updateOne({ _id: user }, { $push: { subscriptions: { _id: community }}});

            return { saveCommunity, saveUser };

        } else {
            const deleteCommunity = await this.communityModel.updateOne({ _id: community }, { $pull: { subs: user }});
            const deleteUser = await this.userModel.updateOne({ _id: user }, { $pull: { subscriptions: community }});

            return { deleteCommunity, deleteUser};
        }

        return "last return"
    }

    async getMyProfile(id){
        const myUser = await this.userModel.findOne({_id: id}).exec();

        return myUser
    }
    //TODO implement get user bookmarks, and communities
    // also get normal users
}
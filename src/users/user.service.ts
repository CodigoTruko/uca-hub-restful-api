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

    async createUser2(registerUserDto: RegisterUserDto ){
        const createdUser = new this.userModel({
            name: registerUserDto.name,
            carnet: registerUserDto.carnet,
            username: registerUserDto.username,
            email: registerUserDto.email,
        });
        createdUser.salt = await createdUser.genSalt
        createdUser.hash = registerUserDto.password
        this.logger.debug(createdUser);
        createdUser.save()
        this.logger.debug(`User created with id: ${createdUser._id}`);
    }
    async findAllUsers(){

        const queryCount = await this.userModel.find().count();
        const queryResults = await this.userModel.find().exec();
        return { count: queryCount, results: queryResults }
        // return await this.userModel.find().exec();
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

    //Works with params being the usernames of the people within the interaction
    async followUser(toFollow, follower){
        this.logger.log(toFollow)
        this.logger.log(follower)

        const userToFollow = await this.userModel.findOne({ _id: toFollow}).exec();
        const userFollowing = await this.userModel.findOne({ _id: follower}).exec();

        this.logger.debug(userToFollow.username)
        this.logger.debug(userFollowing.username)

        if(userToFollow.followers.findIndex( user => user == follower) <=0 || userFollowing.follows.findIndex(user => user == toFollow)){
            
            const saveFollow = await this.userModel.updateOne({ _id: toFollow }, { $push: { followers: { _id: follower }}});
            const saveFollower = await this.userModel.updateOne({ _id: follower }, { $push: { follows: { _id: toFollow }}});

            return { saveFollow, saveFollower};

        } else {
            const deleteFollow = await this.userModel.updateOne({ _id: toFollow }, { $pull: { followers: follower }}).exec();
            const deleteFollower = await this.userModel.updateOne({ _id: follower }, { $pull: { follows: toFollow}}).exec();

            return { deleteFollow, deleteFollower};
        }
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
    }

    async getMyProfile(id){
        const myUser = await this.userModel.findOne({_id: id})
            .populate({
                path: "program",
                populate: {
                    path: "faculty",
                    select: "name",
                    model: "Faculty"
                },
                select: "name"
            })
            .exec();
        this.logger.debug(myUser)
        return myUser
    }

    async updateMyProfile(user){
        /* const userUpdated = await this.userModel.updateOne({ _id:  user.id}, {
            name: user.name,
            carnet: user.carnet,
            username: user.username,
            email: user.email,
            program: user.program,
            description: user.description,
            image: user.image,
        }).exec() */
        console.log(user)
        const userToUpdate = await this.userModel.findById(user.id).exec()
        console.log(userToUpdate)
        userToUpdate.name = user.name
        userToUpdate.carnet = user.carnet,
        userToUpdate.username = user.username
        userToUpdate.email = user.email
        userToUpdate.program = user.program
        userToUpdate.description = user.description
        userToUpdate.image = user.image

        return await userToUpdate.save()
    }

    async searchUsers(keyword: string, documentsToSkip=0, limitOfDocuments=20){

        const usersCount = await this.userModel.find({ $or: [
            { name: { $regex: keyword, $options: 'i'}},
            { carnet: { $regex: keyword, $options: 'i'}},
            { username: { $regex: keyword, $options: 'i'}},
            ]
        }).count()

        const usersResults = await this.userModel.find({ $or: [
                { name: { $regex: keyword, $options: 'i'}},
                { carnet: { $regex: keyword, $options: 'i'}},
                { username: { $regex: keyword, $options: 'i'}},
                ]
            }, 
            {
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
            })
            .skip(documentsToSkip)
            .limit(limitOfDocuments)
            .sort({ username: 1, name: 1, carnet: 1})
            .exec()
        
        return { count: usersCount, results: usersResults}

    }
    //TODO implement get user bookmarks, and communities
    // also get normal users
}
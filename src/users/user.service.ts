import { Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "./models/dtos/registerUserDto";
import { User, UserDocument } from "./models/entities/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginUserDto } from "./models/dtos/loginUserDto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    private readonly logger =  new Logger(UserService.name)
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(registerUserDto: RegisterUserDto ){
        const userSalt = await bcrypt.genSaltSync()
        this.logger.debug(`this is user salt: ${userSalt}`)
        registerUserDto.password = await bcrypt.hash(registerUserDto.password, userSalt)
        registerUserDto.salt =userSalt
        const createdUser = await new this.userModel(registerUserDto).save();
        
        this.logger.debug(`User created with id: ${createdUser._id}`);
    }
    async findAllUsers(){
        return await this.userModel.find().exec();
    }
    async findUserByIdentifier(identifier: string){
        const userFound = await this.userModel.findOne({ $or: [{username: identifier}, {email: identifier}]}).exec();
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

    //TODO implement get user bookmarks, and communities
    // also get normal users
}
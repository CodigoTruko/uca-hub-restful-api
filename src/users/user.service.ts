import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./models/dtos/registerUserDto";
import { User, UserDocument } from "./models/entities/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginUserDto } from "./models/dtos/loginUserDto";


@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async registerUser(registerUserDto: RegisterUserDto ): Promise<UserDocument>{
        const createdUser = new this.userModel(registerUserDto);
        return await createdUser.save();

    }
    async loginUser(loginUserDto: LoginUserDto){
        const user = await this.userModel.findOne({ $or: [{username: loginUserDto.identifier}, {email: loginUserDto.identifier}]});
        return user;
    }
    async findAllUsers(): Promise<User[]>{
        return await this.userModel.find().exec();
    }
    async findUserByIdentifier(identifier: string){
        return await this.userModel.findOne({ $or: [{username: identifier}, {email: identifier}]});
    }
    async findUserById(identifier: string): Promise<UserDocument>{
        return await this.userModel.findById(identifier).exec();
    }
    async findUserByUsername(username: string){
        return await this.userModel.findOne({username: username});
    }
    async findUserByEmail(email: string){
        return await this.userModel.findOne({email: email});
    }

    
}
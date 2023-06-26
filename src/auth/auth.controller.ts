import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Logger, Param, Post, Request, Res, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "../users/models/dtos/registerUserDto";
import {AuthService} from "./auth.service";
import { LoginUserDto } from "../users/models/dtos/loginUserDto";
import { UserService } from "../users/user.service";
import { AuthGuard } from "./auth.guard";
import * as bcrypt from "bcrypt";

@Controller('auth')
export class AuthController{
    private readonly logger = new Logger(AuthController.name);
    
    constructor(
        private authService: AuthService,
        private userService: UserService
    ){}


    async validateUser(identifier: string, pass: string): Promise<any> {
            const user = await this.userService.findUserByIdentifier(identifier);
            if (user && user.password === pass) {
              const { password, ...result } = user;
              return result;
            }
            return null;
    }
    @Post('login')
    async login(@Request() req, @Res() res,@Body() loginUserDto: LoginUserDto) {
        try {

            this.logger.verbose("Attempting Login...")
            const userFound = await this.userService.findUserByIdentifier(loginUserDto.identifier);
            this.logger.debug(userFound)
            //Check if user exists
            if(!userFound) return res.status(404).json({message: 'User not found!'});
            //Compare Passwords
            this.logger.verbose("Checking credentials")
            const hashed = await bcrypt.hash(loginUserDto.password, userFound.salt)
            this.logger.debug(hashed)
            this.logger.debug(userFound.password    )
            const isMatch = await bcrypt.compareSync(userFound.password, hashed)
            this.logger.debug(isMatch)
            if(isMatch) return res.status(401).json({message: "Credentials do not match!"})
            
            //Generate Token
            const token =  await this.authService.login(loginUserDto);
            
            this.logger.verbose("Login Successful!")
            return res.status(200).json(token)
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Post('register')
    async register(@Res() res, @Body() registerUserDto:  RegisterUserDto){
        try {
            this.logger.verbose('User trying to register...');
            const userFound = await this.userService.findUserByIdentifier(registerUserDto.email) || await this.userService.findUserByIdentifier(registerUserDto.username);
            
            if(userFound) {
                return res.status(409).json({message: 'User already exists!'});
            }
            await this.userService.createUser(registerUserDto);
            this.logger.verbose("User registered!");
            return res.status(201).json({ message: "User registered"});
        } catch (error) {
            this.logger.error(error)
            return res.status(500).json({message: "Internal server error!"});
        }
    }
    /* @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    } */
}
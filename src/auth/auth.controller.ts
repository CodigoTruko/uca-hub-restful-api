import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Logger, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "../users/models/dtos/registerUserDto";
import { Request, Response } from "express";
import {AuthService} from "./auth.service";
import { LoginUserDto } from "../users/models/dtos/loginUserDto";
import { UserService } from "../users/user.service";
import * as bcrypt from "bcrypt";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController{
    private readonly logger = new Logger(AuthController.name);
    
    constructor(
        private authService: AuthService,
        private userService: UserService
    ){}

    @Post("/v2/register")
    async registerv2(@Req() req: Request, @Res() res: Response, @Body() user: RegisterUserDto){
        try {
            this.logger.verbose('User trying to register...');
            const userFound = await this.userService.findUserByIdentifier(user.email) || await this.userService.findUserByIdentifier(user.username);
            
            if(userFound) return res.status(409).json({message: 'User already exists!'});
            

            await this.userService.createUser2(user);
            this.logger.verbose("User registered!");
            return res.status(201).json({ message: "User Registered!"})
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }
    }
    @Post("/v2/login")
    async loginv2(@Req() req: Request, @Res() res: Response, @Body() user: LoginUserDto){
        try {
            const userFound = await this.userService.findUserByIdentifier(user.identifier);
            if(!userFound) return res.status(404).json({ error: "User not found!"})

            this.logger.verbose("Checking credentials")
            this.logger.debug(userFound.password)
            this.logger.debug(await bcrypt.hash(user.password, userFound.salt))

            if(userFound.password != await bcrypt.hash(user.password, userFound.salt)) return res.status(401).json({error: "Unauthorized!"})

            const token =  await this.authService.login(user);
            
            this.logger.verbose("Login Successful!")
            return res.status(200).json({ token: token })

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({error: "Internal server error!"})
        }
    }

    @Post('login')
    async login(@Req() req: Request, @Res() res: Response, @Body() loginUserDto: LoginUserDto) {
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
            this.logger.debug(userFound.password)
            const isMatch = await bcrypt.compareSync(userFound.password, hashed)
            this.logger.debug(isMatch)
            if(isMatch) return res.status(401).json({message: "Credentials do not match!"})
            
            //Generate Token
            const token =  await this.authService.login(loginUserDto);
            
            this.logger.verbose("Login Successful!")
            return res.status(200).json({ token: token })
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Post('register')
    async register(@Req() req: Request, @Res() res: Response, @Body() registerUserDto:  RegisterUserDto){
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
    /* @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginUserDto: LoginUserDto) {
        return this.authService.signIn(loginUserDto.identifier, loginUserDto.password);
    } */

    /* @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request, @Res() res: Response) {
        try {
            const user = req.user
            const profile = await this.userService.findUserByIdentifier(user["username"]);

            return res.status(200).json(profile)
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: "Internal server error!"});
        }
    } */
}
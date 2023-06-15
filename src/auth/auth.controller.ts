import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Res } from "@nestjs/common";
import { RegisterUserDto } from "../users/models/dtos/registerUserDto";
import {AuthService} from "./auth.service";
import { LoginUserDto } from "../users/models/dtos/loginUserDto";
import { UserService } from "../users/user.service";

@Controller('auth')
export class AuthController{
    private readonly logger = new Logger(AuthController.name);
    
    constructor(
        private authService: AuthService,
        private userService: UserService
        ){}

    //TODO: Implement Login Bussiness Logic
    @Post('login')
    async login(@Res() res,@Body() loginUserDto: LoginUserDto) {
        try {
            this.logger.verbose('Attempting Login...')
            const userFound = this.userService.findUserByIdentifier(loginUserDto.identifier);

            //Check if user exists
            if(!userFound) return res.status(404).json({message: 'User not found!'});
            //Compare Passwords
            if( loginUserDto.password !== (await userFound).password) return res.status(401).json({message: 'Invalid credentials!'});
            
            //Generate Token
            this.authService.login(loginUserDto);
            
            this.logger.verbose('Login Successful!')
            return 
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    //TODO: Implement Login Bussiness Logic
    @Post('register')
    register(@Res() res, @Body() registerUserDto:  RegisterUserDto){
        try {
            const userFound = this.userService.findUserByIdentifier(registerUserDto.email) || this.userService.findUserByIdentifier(registerUserDto.username);
            if(userFound) {
                return res.status(409).json({message: 'User already exists!'});
            }
            this.userService.createUser(registerUserDto);
        } catch (error) {
            return res.status(500).json({message: 'Internal server error!'});
        }

    }
    
}
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
    @Post('login')
    login(@Res() res,@Body() loginUserDto: LoginUserDto) {

        

        return this.authService.signIn(loginUserDto);
    }

    @Post('register')
    register(@Res() res, @Body() registerUserDto:  RegisterUserDto){
        try {
            const userFound = this.userService.findUserByIdentifier(registerUserDto.email) || this.userService.findUserByIdentifier(registerUserDto.username);
            if(userFound) {
                return res.status(409).json({message: 'User already exists!'});
            }
            this.userService.registerUser(registerUserDto);
        } catch (error) {
            return res.status(500).json({message: 'Internal server error!'});
        }

    }
    
}
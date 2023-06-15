import { Body, Controller, Get, Logger, Param, Post, Res } from "@nestjs/common";
import { RegisterUserDto } from "./models/dtos/registerUserDto";
import { LoginUserDto } from "./models/dtos/loginUserDto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

    private readonly logger = new Logger(UserController.name);
    constructor(private userService: UserService) {}

    @Post()
    registerUser(@Res() res, @Body() registerUserDto: RegisterUserDto){
        try {
            
            if((this.userService.findUserByIdentifier(registerUserDto.username) || this.userService.findUserByIdentifier(registerUserDto.email))){
                return res.status(400).json({message: 'User already exists!'});
            }

            this.userService.registerUser(registerUserDto);
            return res.status(201).json({message: 'User created successfully!'});

        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Post()
    loginUser(@Res() res, @Body() loginUserDto: LoginUserDto){
        try {
            if(!this.userService.findUserByIdentifier(loginUserDto.identifier)){
                return res.status(404).json({message: 'User Not Found!'});
            }
            return res.status(200).json({message: 'User logged in successfully!'});
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }
    @Get(':id')
    findUserByUsername(@Res() res, @Param('id') id: string){
        try {
            
        } catch (error) {
            this.logger.error(error);
            return res.status(500).json({message: 'Internal server error!'});
        }
    }   
}
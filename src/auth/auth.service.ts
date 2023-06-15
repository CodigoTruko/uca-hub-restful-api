import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RegisterUserDto } from "../users/models/dtos/registerUserDto";
import { UserService } from "../users/user.service";
import { LoginUserDto } from "src/users/models/dtos/loginUserDto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.usersService.findUserByIdentifier(loginUserDto.identifier) || await this.usersService.findUserById(loginUserDto.identifier);
        const { password, ...result } = user;
        const payload = { sub: user._id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    
    async register(registerUserDto: RegisterUserDto): Promise<any>{
        const user = await this.usersService.registerUser(registerUserDto);
        const {password, ...result} = user;
        return result;
    }
}
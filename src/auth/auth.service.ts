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

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersService.findUserByIdentifier(loginUserDto.identifier);
        const payload = { sub: user._id, username: user.username };
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
    }
}
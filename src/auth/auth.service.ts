import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RegisterUserDto } from "../users/models/dtos/registerUserDto";
import { UserService } from "../users/user.service";
import { LoginUserDto } from "src/users/models/dtos/loginUserDto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userService.findUserByIdentifier(loginUserDto.identifier);
        const payload = { sub: user._id, username: user.username };
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
    }
    async signIn(username, pass) {
        const user = await this.userService.findUserByUsername(username);
        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user._id, username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.userService.findUserByIdentifier(identifier);
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
  }
}
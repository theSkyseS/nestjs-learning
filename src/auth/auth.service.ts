import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserModel } from 'src/users/users.model';
import { Payload } from 'src/auth/auth.payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: CreateUserDto) {
    const userData = await this.userService.getUserByEmail(user.email);
    if (!userData) {
      throw new BadRequestException('User not found');
    }
    const isValid = await this.validatePassword(
      user.password,
      userData.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return await this.generateAccessToken(userData);
  }

  async register(user: CreateUserDto) {
    const userData = await this.userService.getUserByEmail(user.email);
    if (userData) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });
    return await this.generateAccessToken(newUser);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  private async generateAccessToken(newUser: UserModel) {
    const payload: Payload = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles.map((role) => role.name),
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

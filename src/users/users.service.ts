import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';
import { RolesService } from 'src/roles/roles.service';
import { RoleModel } from 'src/roles/roles.model';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private userRepository: typeof UserModel,
    private rolesService: RolesService,
    private authService: AuthService,
  ) {}

  async login(user: CreateUserDto) {
    const userData = await this.getUserByEmail(user.email);
    if (!userData) {
      throw new BadRequestException('User not found');
    }

    const isValid = await this.authService.validatePassword(
      user.password,
      userData.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.authService.generateToken(userData);
    this.authService.saveRefreshToken(tokens.refresh_token, userData.id);
    return { user: userData, response: tokens };
  }

  async register(user: CreateUserDto) {
    const userData = await this.getUserByEmail(user.email);
    if (userData) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.createUser({
      ...user,
      password: hashedPassword,
    });
    const tokens = await this.authService.generateToken(newUser);
    this.authService.saveRefreshToken(tokens.refresh_token, newUser.id);
    return { user: newUser, response: tokens };
  }

  async logout(refreshToken: string) {
    const tokenData = await this.authService.removeRefreshToken(refreshToken);
    return tokenData;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokenData = await this.authService.findRefreshToken(refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const userData = tokenData.user;
    const tokens = await this.authService.generateToken(userData);
    this.authService.saveRefreshToken(tokens.refresh_token, userData.id);
    return { user: userData, response: tokens };
  }

  async createUser(dto: CreateUserDto): Promise<UserModel> {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByName('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers(): Promise<UserModel[]> {
    return await this.userRepository.findAll({ include: RoleModel });
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: { email },
      include: RoleModel,
    });
  }
}

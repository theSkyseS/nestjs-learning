import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';
import { RolesService } from 'src/roles/roles.service';
import { RoleModel } from 'src/roles/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private userRepository: typeof UserModel,
    private rolesService: RolesService,
  ) {}

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

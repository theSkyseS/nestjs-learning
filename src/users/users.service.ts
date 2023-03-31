import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';
import { RolesService } from 'src/roles/roles.service';

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
    return await this.userRepository.create(dto);
  }

  async getAllUsers(): Promise<UserModel[]> {
    return await this.userRepository.findAll({ include: { all: true } });
  }
}

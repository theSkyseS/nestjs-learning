import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private userRepository: typeof UserModel,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserModel> {
    return await this.userRepository.create(dto);
  }

  async getAllUsers(): Promise<UserModel[]> {
    return await this.userRepository.findAll({ include: { all: true } });
  }
}

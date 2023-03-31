// Import the necessary modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from './roles.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
  ) {}

  async findAll(): Promise<RoleModel[]> {
    return await this.roleModel.findAll();
  }

  async findByName(name: string): Promise<RoleModel> {
    return await this.roleModel.findOne({
      where: {
        name: name,
      },
    });
  }

  async create(role: CreateRoleDto): Promise<RoleModel> {
    return await this.roleModel.create(role);
  }
}


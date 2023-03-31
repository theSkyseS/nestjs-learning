import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleModel } from './roles.model';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({ status: 201, type: RoleModel })
  @Post()
  create(dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @ApiOperation({ summary: 'Retrieves all users from the Database' })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Get()
  getAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Retrieves all users from the Database' })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.rolesService.findByName(name);
  }
}


import { Controller, Get, Post, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleModel } from './roles.model';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Creates a new role' })
  @ApiResponse({ status: 201, type: RoleModel })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  create(@Param('roleDto') dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @ApiOperation({ summary: 'Retrieves all roles from the Database' })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Get()
  getAll() {
    return this.rolesService.getAllRoles();
  }

  @ApiOperation({
    summary: 'Retrieves role with specified name from the Database',
  })
  @ApiResponse({ status: 200, type: [RoleModel] })
  @Get(':name')
  getByName(@Param('name') name: string) {
    return this.rolesService.getRoleByName(name);
  }
}

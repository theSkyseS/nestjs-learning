import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { ProfileModel } from 'src/profiles/profiles.model';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AddRoleDto } from './dto/add-role.dto';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersServise: UsersService,
    private profilesService: ProfilesService,
  ) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({ status: 201, type: UserModel })
  @ApiBody({ type: CreateUserDto })
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @ApiOperation({ summary: 'Retrieves all users from the Database' })
  @ApiResponse({ status: 200, type: [UserModel] })
  @Get()
  getAll() {
    return this.usersServise.getAllUsers();
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.usersServise.login(userDto);
  }

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({ status: 201, type: ProfileModel })
  @ApiBody({ type: CreateProfileDto })
  @Post('/register')
  register(@Body() userDto: CreateProfileDto) {
    return this.profilesService.registerNewUser(userDto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiBody({
    description: 'Refresh token',
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string' },
      },
    },
  })
  @UseGuards(AuthGuard)
  @Get('/refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.usersServise.refresh(refreshToken);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    description: 'Refresh token',
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string' },
      },
    },
  })
  @UseGuards(AuthGuard)
  @Get('/logout')
  logout(@Body('refreshToken') refreshToken: string) {
    return this.usersServise.logout(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersServise.addRoleToUser(dto);
  }

  @ApiOperation({ summary: 'Retrieves user from the Database' })
  @ApiResponse({ status: 200, type: UserModel })
  @Get(':id')
  get(@Param('id') id: number) {
    return this.usersServise.getUserById(id);
  }
}

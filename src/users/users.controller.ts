import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({ status: 201, type: UserModel })
  @ApiBody({ type: CreateUserDto })
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
}

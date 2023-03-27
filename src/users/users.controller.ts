import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @Get()
  getAll() {
    return this.usersServise.getAllUsers();
  }
}

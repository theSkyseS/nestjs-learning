import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from 'src/files/dto/create-file.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() dto: CreatePostDto & CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('/group/:group')
  findByGroup(@Param('group') group: string) {
    return this.postsService.findByGroup(group);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}

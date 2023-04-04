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
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PostModel } from './posts.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Creates a new post' })
  @ApiResponse({ status: 201, type: PostModel })
  @ApiBody({ type: CreatePostDto })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.create(dto, file);
  }

  @ApiOperation({ summary: 'Retrieves all posts from the Database' })
  @ApiResponse({ status: 200, type: [PostModel] })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieves posts from specified group from the Database',
  })
  @ApiResponse({ status: 200, type: [PostModel] })
  @ApiParam({ name: 'group', required: true })
  @Get('/group/:group')
  findByGroup(@Param('group') group: string) {
    return this.postsService.findByGroup(group);
  }

  @ApiOperation({
    summary: 'Retrieves post with specified id from the Database',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, type: PostModel })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Updates post with specified id' })
  @ApiResponse({ status: 200, type: PostModel })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: CreatePostDto })
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Deletes post with specified id' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'id', required: true })
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from './posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel) private postRepository: typeof PostModel,
  ) {}

  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.create(createPostDto);
  }

  async findAll() {
    return await this.postRepository.findAll();
  }

  async findOne(id: string) {
    return await this.postRepository.findByPk(id);
  }

  async findByGroup(group: string) {
    return await this.postRepository.findAll({
      where: { group },
    });
  }

  async update(id: string, updatePostDto: CreatePostDto) {
    const post = await this.postRepository.findByPk(id);
    return await post.update(updatePostDto);
  }

  async remove(id: string) {
    const post = await this.postRepository.findByPk(id);
    return await post.destroy();
  }
}

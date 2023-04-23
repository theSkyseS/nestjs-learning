import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from '../files/files.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './posts.model';

@Injectable()
export class PostsService {
  private readonly POST_ESSENCE_NAME: string = 'posts';
  constructor(
    @InjectModel(PostModel) private postRepository: typeof PostModel,
    private readonly filesService: FilesService,
  ) {}

  async create(dto: CreatePostDto, file: Express.Multer.File) {
    let fileName: string = null;
    const post = await this.postRepository.create(dto);
    if (file) {
      fileName = (
        await this.filesService.createFile(
          {
            essenceId: post.id,
            essenceTable: this.POST_ESSENCE_NAME,
          },
          file,
        )
      ).fileName;
      post.set('image', fileName);
      post.save();
    }
    return post;
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
    const transaction = await this.postRepository.sequelize.transaction();
    try {
      const post = await this.postRepository.findByPk(id);
      await this.filesService.queueToRemove(post.image);
      return await post.destroy();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
}

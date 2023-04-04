import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from './posts.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostsService {
  private readonly POST_ESSENCE_NAME: string = 'posts';
  constructor(
    @InjectModel(PostModel) private postRepository: typeof PostModel,
    private readonly filesService: FilesService,
  ) {}

  async create(dto: CreatePostDto, file: Express.Multer.File) {
    let fileName: string = null;
    if (file) {
      fileName = (
        await this.filesService.createFile(
          {
            essenceId: dto.searchTitle,
            essenceTable: this.POST_ESSENCE_NAME,
          },
          file,
        )
      ).fileName;
    }
    return await this.postRepository.create({
      ...dto,
      image: fileName,
    });
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

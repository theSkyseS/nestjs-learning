import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { FilesService } from '../files/files.service';
import { PostModel } from './posts.model';
import { FilesModel } from '../files/files.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateFileDto } from '../files/dto/create-file.dto';

describe('PostsService and FilesService integration', () => {
  let postService: PostsService;
  let filesService: FilesService;

  const dto: CreatePostDto = {
    searchTitle: 'Title',
    title: 'Title',
    text: 'Content',
    group: 'Group',
  };

  const file: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'file.txt',
    filename: 'file.txt',
    mimetype: 'text/plain',
    destination: './uploads',
    size: 0,
    path: 'something',
    buffer: Buffer.from('one,two,three'),
    encoding: undefined,
    stream: undefined,
  };

  const fileDto: CreateFileDto = {
    essenceId: 1,
    essenceTable: 'posts',
  };

  const postMock = {
    id: 1,
    searchTitle: 'Title',
    title: 'Title',
    content: 'Content',
    group: 'Group',
    set: jest.fn((field, value) => (postMock[field] = value)),
    save: jest.fn(),
    destroy: jest.fn(),
  };

  const fileMock = {
    fileName: 'fileName',
    essenceTable: 'posts',
    essenceId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        FilesService,
        {
          provide: getModelToken(PostModel),
          useValue: {
            findAll: jest.fn(() => [postMock]),
            findOne: jest.fn(),
            findByPk: jest.fn(() => postMock),
            create: jest.fn(() => postMock),
            destroy: jest.fn(),
            sequelize: {
              transaction: () => ({
                commit: jest.fn(),
                rollback: jest.fn(),
              }),
            },
          },
        },
        {
          provide: getModelToken(FilesModel),
          useValue: {
            findAll: jest.fn(() => [fileMock]),
            findOne: jest.fn(),
            findByPk: jest.fn(() => fileMock),
            create: jest.fn(() => fileMock),
            destroy: jest.fn(),
            update: jest.fn(),
            sequelize: {
              transaction: () => ({
                commit: jest.fn(),
                rollback: jest.fn(),
              }),
            },
          },
        },
      ],
    }).compile();

    postService = module.get<PostsService>(PostsService);
    filesService = module.get<FilesService>(FilesService);
  });

  describe('create', () => {
    it("should create a new post and file and put filename in the post's image field", async () => {
      const spy = jest.spyOn(filesService, 'createFile');
      const result = await postService.create(dto, file);
      expect(spy).toHaveBeenCalledWith(fileDto, file);
      expect(result.image).toBeDefined();
    });

    it("should not call a fileservice if file wasn't provided", async () => {
      const spy = jest.spyOn(filesService, 'createFile');
      await postService.create(dto, undefined);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it("should remove the post's image", async () => {
      const spy = jest.spyOn(filesService, 'queueToRemove');
      await postService.remove('1');
      expect(spy).toHaveBeenCalledWith(postMock.image);
    });
  });
});

import { CreateProfileDto } from './dto/create-profile.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { UsersService } from 'src/users/users.service';
import { ProfileModel } from './profiles.model';
import { getModelToken } from '@nestjs/sequelize';

describe('ProfilesService', () => {
  const userMock = {
    id: 1,
    email: 'johndoe@example.com',
    password: 'encryptedString123',
    roles: [],
  };

  const dto: CreateProfileDto = {
    email: 'janedoe@example.com',
    password: 'encryptedString123',
    name: 'Jane Doe',
    phoneNumber: '0987654321',
    about: 'I hate tomatoes',
    address: '456 Oak St',
  };

  const profileMock = {
    id: 1,
    name: 'Jane Doe',
    phoneNumber: '0987654321',
    about: 'I hate tomatoes',
    address: '456 Oak St',
  };

  let service: ProfilesService;
  let model: typeof ProfileModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: UsersService,
          useValue: {
            register: jest.fn().mockReturnValue({
              user: userMock,
              tokens: {},
            }),
          },
        },
        {
          provide: getModelToken(ProfileModel),
          useValue: {
            findAll: jest.fn(() => [userMock]),
            findOne: jest.fn(),
            create: jest.fn(() => profileMock),
            remove: jest.fn(),
            destroy: jest.fn(() => oneUser),
          },
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    model = module.get<typeof ProfileModel>(getModelToken(ProfileModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerNewUser', () => {
    it('should create a new profile', async () => {
      const result = await service.registerNewUser(dto);
      expect(result).toEqual(expect.objectContaining(profileMock));
    });
  });
});

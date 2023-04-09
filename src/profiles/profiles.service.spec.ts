import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileModel } from './profiles.model';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  const userMock = {
    id: 1,
    email: 'johndoe@example.com',
    password: 'encryptedString123',
    roles: [],
  };

  const tokensMock = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
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
    userId: undefined,
    user: undefined,
    $set: jest.fn(() => {
      profileMock.userId = userMock.id;
    }),
  };

  let service: ProfilesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: UsersService,
          useValue: {
            register: jest.fn().mockReturnValue({
              user: userMock,
              response: tokensMock,
            }),
          },
        },
        {
          provide: getModelToken(ProfileModel),
          useValue: {
            findAll: jest.fn(() => [profileMock]),
            findOne: jest.fn(),
            findByPk: jest.fn(() => profileMock),
            create: jest.fn(() => profileMock),
            destroy: jest.fn(),
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

    service = module.get<ProfilesService>(ProfilesService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerNewUser', () => {
    it('should create a new profile', async () => {
      const expectedProfile = {
        id: 1,
        name: 'Jane Doe',
        phoneNumber: '0987654321',
        about: 'I hate tomatoes',
        address: '456 Oak St',
        userId: userMock.id,
        user: userMock,
      };
      const expectedTokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      const result = await service.registerNewUser(dto);
      expect(result).toEqual({
        profile: expect.objectContaining(expectedProfile),
        tokens: expectedTokens,
      });
    });

    it('should register a new user', async () => {
      const registerSpy = jest.spyOn(usersService, 'register');
      await service.registerNewUser(dto);
      expect(registerSpy).toHaveBeenCalledWith(dto);
    });

    it('should assign user to profile', async () => {
      const result = await service.registerNewUser(dto);
      expect(result.profile.user).toEqual(userMock);
      expect(result.profile.userId).toEqual(userMock.id);
    });
  });
});

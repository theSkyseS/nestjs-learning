import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UserModel } from '../src/users/users.model';

describe('UsersController (e2e)', () => {
  type Tokens = { access_token: string; refresh_token: string };
  let app: INestApplication;
  const adminUser: CreateUserDto = {
    email: 'Petr@gmail.com',
    password: '123',
  };
  const user: CreateUserDto = {
    email: 'USER@gmail.com',
    password: '321',
  };
  const nonExistentUser: CreateUserDto = {
    email: 'nonExistent@gmail.com',
    password: 'test',
  };
  const newUser: CreateUserDto = {
    email: 'newuser@gmail.com',
    password: 'test',
  };

  let adminTokens: Tokens;
  let userTokens: Tokens;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users/login (POST)', () => {
    it('should respond 401 if password is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: adminUser.email,
          password: 'test',
        })
        .expect(401);
    });

    it("should respond 400 if user doesn't exist", async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send(nonExistentUser)
        .expect(400);
    });

    it('should respond 201 if user exists and password is correct', async () => {
      const adminResponse = await request(app.getHttpServer())
        .post('/users/login')
        .send(adminUser)
        .expect(201);
      adminTokens = adminResponse.body.response;

      const userResponse = await request(app.getHttpServer())
        .post('/users/login')
        .send(user)
        .expect(201);
      userTokens = userResponse.body.response;
    });
  });

  describe('/users (POST)', () => {
    it('should respond 401 if unauthorized', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(401);
    });

    it('should respond 403 if not admin', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send(newUser)
        .expect(403);
    });

    it('should create a user and respond 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send(newUser)
        .expect(201);
      expect(response.body.user.email).toEqual(newUser.email);
      expect(response.body.user).toBeInstanceOf(UserModel);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UserModel } from '../src/users/users.model';
import { CreateProfileDto } from '../src/profiles/dto/create-profile.dto';
import { RoleModel } from '../src/roles/roles.model';
import { ProfileModel } from '../src/profiles/profiles.model';
import { UserRolesModel } from '../src/roles/user-roles.model';
import { RefreshModel } from '../src/auth/refresh-token.model';
import * as bcrypt from 'bcryptjs';

describe('UsersController (e2e)', () => {
  type Tokens = { access_token: string; refresh_token: string };
  let app: INestApplication;
  const adminUser: CreateUserDto = {
    email: 'ADMIN@gmail.com',
    password: '123',
  };
  const adminUserHashedPassword =
    '$2a$10$4cUC/HXzYwmpKC8tNPgNYOU4fVNkx0.SPPCHtMk8YEyVNmzQtzwIS';

  const user: CreateUserDto = {
    email: 'USER@gmail.com',
    password: '321',
  };
  const userHashedPassword =
    '$2a$10$a/kgi.9HhUBvNZX6.G6N8uZ01nIEQmGlToZfbZEVvJBRM/tsWNXLS';

  const nonExistentUser: CreateUserDto = {
    email: 'nonExistent@gmail.com',
    password: 'test',
  };
  const newUser: CreateUserDto = {
    email: 'newuser@gmail.com',
    password: 'test',
  };

  const registerUser: CreateProfileDto = {
    email: 'neweruser@gmail.com',
    password: 'test123',
    name: 'newer user',
    phoneNumber: '+79991234567',
    about: 'I am user',
    address: 'User st., 25',
  };

  let adminTokens: Tokens;
  let userTokens: Tokens;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const createdAdmin = await UserModel.create({
      email: adminUser.email,
      password: adminUserHashedPassword,
    });

    const createdUser = await UserModel.create({
      email: user.email,
      password: userHashedPassword,
    });
    userId = createdUser.id;

    const userRole = await RoleModel.create({
      name: 'USER',
    });

    const adminRole = await RoleModel.create({
      name: 'ADMIN',
    });

    await createdAdmin.$add('roles', userRole.id);
    await createdAdmin.$add('roles', adminRole.id);
    await createdUser.$add('roles', userRole.id);
  });

  beforeEach(async () => {
    /* */
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
    const url = '/users';
    postNotAuthorized(url, newUser);

    postNotAdmin(url, newUser);

    it('should create a user and respond 201', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send(newUser)
        .expect(201);
      expect(response.body.email).toEqual(newUser.email);
      expect(response.body).toMatchObject<UserModel>(
        expect.objectContaining(newUser),
      );
    });
  });

  describe('/users (GET)', () => {
    it('should return array of objects', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
      expect(response.body).toMatchObject<UserModel>(
        expect.objectContaining({
          email: user.email,
          password: userHashedPassword,
        }),
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          email: user.email,
          password: userHashedPassword,
        }),
      );
    });
  });

  describe('/users/role (POST)', () => {
    const url = '/users/role';
    postNotAuthorized(url, {
      userId: userId,
      role: 'ADMIN',
    });

    postNotAdmin(url, {
      userId: userId,
      role: 'ADMIN',
    });

    it('should add role to user if admin', async () => {
      let response = await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send({
          userId: userId,
          role: 'ADMIN',
        })
        .expect(201);
      expect(response.body.email).toEqual(user.email);
      response = await request(app.getHttpServer()).get(`/users/${userId}`);
      expect(response.body.roles).toContainEqual(
        expect.objectContaining({ name: 'ADMIN' }),
      );
    });
  });

  describe('/users/role/remove (POST)', () => {
    const url = '/users/role/remove';
    postNotAuthorized(url, {
      userId: userId,
      role: 'ADMIN',
    });

    postNotAdmin(url, {
      userId: userId,
      role: 'ADMIN',
    });

    it('should remove role from user if admin', async () => {
      let response = await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send({
          userId: userId,
          role: 'ADMIN',
        })
        .expect(201);
      expect(response.body.email).toEqual(user.email);
      response = await request(app.getHttpServer()).get(`/users/${userId}`);
      expect(response.body.roles).not.toContainEqual(
        expect.objectContaining({ name: 'ADMIN' }),
      );
    });
  });

  describe('/users/refresh (POST)', () => {
    let userTokens: Tokens;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send(user);
      userTokens = response.body.response;
    });

    it('should return new tokens', async () => {
      console.log(userTokens);
      const response = await request(app.getHttpServer())
        .post('/users/refresh')
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send({ refresh_token: userTokens.refresh_token })
        .expect(201);
      expect(response.body.tokens).toEqual<Tokens>({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });

  describe('/users/logout (POST)', () => {
    let userTokens: Tokens;
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send(user);
      userTokens = response.body.response;
    });

    it('should remove refresh token from the database', async () => {
      await request(app.getHttpServer())
        .post('/users/logout')
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send({ refresh_token: userTokens.refresh_token })
        .expect(201);
    });
  });

  describe('users/:id (PUT)', () => {
    const newEmail = 'newEmail@gmail.com';
    const newPassword = 'newPassword';

    it('should respond 401 if not authorized', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({
          email: newEmail,
          password: newPassword,
        })
        .expect(401);
    });

    it('should respond 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send({
          email: newEmail,
          password: newPassword,
        })
        .expect(403);
    });

    it('should update user', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .send({
          email: newEmail,
          password: newPassword,
        })
        .expect(200);
      expect(response.body.email).toEqual(newEmail);
      expect(bcrypt.compareSync(newPassword, response.body.password)).toBe(
        true,
      );
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should respond 401 if not authorized', async () => {
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(401);
    });

    it('should respond 403 if user is not admin', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .query({ id: userId })
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .expect(403);
    });

    it('should delete user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminTokens.access_token}`)
        .expect(200);
    });
  });

  describe('/users/register (POST)', () => {
    it('should return profile and tokens', async () => {
      const profile = {
        name: 'newer user',
        phoneNumber: '+79991234567',
        about: 'I am user',
        address: 'User st., 25',
      };
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(registerUser)
        .expect(201);
      expect(response.body.profile).toEqual(expect.objectContaining(profile));
      expect(response.body.tokens).toEqual<Tokens>({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });

  afterAll(async () => {
    const truncates = Promise.all([
      RefreshModel.truncate({
        cascade: true,
        force: true,
        restartIdentity: true,
      }),
      ProfileModel.truncate({
        cascade: true,
        force: true,
        restartIdentity: true,
      }),
      UserRolesModel.truncate({
        cascade: true,
        force: true,
        restartIdentity: true,
      }),
      UserModel.truncate({
        cascade: true,
        force: true,
        restartIdentity: true,
      }),
      RoleModel.truncate({
        cascade: true,
        force: true,
        restartIdentity: true,
      }),
    ]);
    await truncates;
    await app.close();
  });

  function postNotAuthorized(url: string, send: any) {
    it('should respond 401 if unauthorized', async () => {
      await request(app.getHttpServer()).post(url).send(send).expect(401);
    });
  }

  function postNotAdmin(url: string, send: any) {
    it('should respond 403 if not admin', async () => {
      await request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${userTokens.access_token}`)
        .send(send)
        .expect(403);
    });
  }
});

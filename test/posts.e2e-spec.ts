import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect('This action returns all posts');
  });

  it('/posts/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts/1')
      .expect(200)
      .expect('This action returns post #1');
  });

  it('/posts (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'Test Post', body: 'This is a test post' })
      .expect(201)
      .expect('This action creates a new post');
  });

  it('/posts/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/posts/1')
      .send({
        title: 'Updated Test Post',
        body: 'This is an updated test post',
      })
      .expect(200)
      .expect('This action updates post #1');
  });

  it('/posts/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/posts/1')
      .expect(200)
      .expect('This action removes post #1');
  });
});

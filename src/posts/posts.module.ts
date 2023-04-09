import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { PostsController } from './posts.controller';
import { PostModel } from './posts.model';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [SequelizeModule.forFeature([PostModel]), AuthModule, FilesModule],
})
export class PostsModule {}

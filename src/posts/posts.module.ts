import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from './posts.model';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [SequelizeModule.forFeature([PostModel]), AuthModule, FilesModule],
})
export class PostsModule {}

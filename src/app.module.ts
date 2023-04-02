import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { RoleModel } from './roles/roles.model';
import { UserRolesModel } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfileModel } from './profiles/profiles.model';
import { PostsModule } from './posts/posts.module';
import { PostModel } from './posts/posts.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [UserModel, RoleModel, UserRolesModel, ProfileModel, PostModel],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProfilesModule,
    PostsModule,
    FilesModule,
  ],
})
export class AppModule {}

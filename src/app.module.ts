import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { PostModel } from './posts/posts.model';
import { PostsModule } from './posts/posts.module';
import { ProfileModel } from './profiles/profiles.model';
import { ProfilesModule } from './profiles/profiles.module';
import { RoleModel } from './roles/roles.model';
import { RolesModule } from './roles/roles.module';
import { UserRolesModel } from './roles/user-roles.model';
import { UserModel } from './users/users.model';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'testing' ? '.testing.env' : '.env',
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

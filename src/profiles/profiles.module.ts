import { Module, forwardRef } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from './profiles.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProfilesService],
  controllers: [ProfilesController],
  imports: [
    SequelizeModule.forFeature([ProfileModel]),
    forwardRef(() => UsersModule),
    AuthModule,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}

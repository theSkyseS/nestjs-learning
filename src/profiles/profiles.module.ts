import { Module, forwardRef } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from './profiles.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ProfilesService],
  controllers: [ProfilesController],
  imports: [
    SequelizeModule.forFeature([ProfileModel]),
    forwardRef(() => UsersModule),
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}

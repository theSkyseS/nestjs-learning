import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileModel } from './profiles.model';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(ProfileModel) private profileRepository: typeof ProfileModel,
    private usersService: UsersService,
  ) {}

  async registerNewUser(userDto: CreateProfileDto) {
    const transaction = await this.profileRepository.sequelize.transaction();
    try {
      const auth = await this.usersService.register(userDto);
      const user = auth.user;
      const tokens = auth.response;
      const profile = await this.profileRepository.create(userDto);
      await profile.$set('user', user);
      profile.user = user;
      transaction.commit();
      return { profile, tokens };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getProfileByUserId(userId: string) {
    return await this.profileRepository.findOne({
      where: { user: userId },
    });
  }

  async getProfileById(id: string) {
    return await this.profileRepository.findByPk(id);
  }

  async getAllProfiles() {
    return await this.profileRepository.findAll();
  }

  async updateProfile(id: string, userDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findByPk(id);
    return await profile.update(userDto);
  }

  async deleteProfile(id: string) {
    const profile = await this.profileRepository.findByPk(id);
    return await profile.destroy();
  }
}

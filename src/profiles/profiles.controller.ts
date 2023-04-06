import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProfileAccessGuard } from '../auth/profile-access.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileModel } from './profiles.model';
import { ProfilesService } from './profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @ApiOperation({ summary: "Retrieves user's profile from the Database" })
  @ApiResponse({ status: 200, type: ProfileModel })
  @Get(':userId')
  getByUserId(@Param('userId') userId: string) {
    return this.profilesService.getProfileByUserId(userId);
  }

  @ApiOperation({ summary: 'Retrieves profile by Id from the Database' })
  @ApiResponse({ status: 200, type: ProfileModel })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.profilesService.getProfileById(id);
  }

  @UseGuards(ProfileAccessGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateProfileDto) {
    return this.profilesService.updateProfile(id, userDto);
  }

  @UseGuards(ProfileAccessGuard)
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.profilesService.deleteProfile(id);
  }
}

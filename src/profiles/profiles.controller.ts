import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileModel } from './profiles.model';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Profiles')
@UseGuards(RolesGuard)
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

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UpdateProfileDto) {
    return this.profilesService.updateProfile(id, userDto);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.profilesService.deleteProfile(id);
  }
}

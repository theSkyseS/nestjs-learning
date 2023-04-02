import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserModel } from 'src/users/users.model';
import { Payload } from 'src/auth/auth.payload';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshModel } from './refresh-token.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshModel) private refreshRepository: typeof RefreshModel,
    private jwtService: JwtService,
  ) {}

  async findRefreshToken(refreshToken: string) {
    return await this.refreshRepository.findByPk(refreshToken);
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const userData = await this.jwtService.verifyAsync<Payload>(
        refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  async validateAccessToken(accessToken: string) {
    try {
      const userData = await this.jwtService.verifyAsync<Payload>(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveRefreshToken(refreshToken: string, userId: number) {
    const tokenData = await this.refreshRepository.findOne({
      where: {
        userId,
      },
    });

    if (tokenData) {
      await tokenData.update({
        refreshToken,
      });
    } else {
      await this.refreshRepository.create({
        userId,
        refreshToken,
      });
    }
  }

  async removeRefreshToken(refreshToken: string) {
    const tokenData = await this.refreshRepository.findByPk(refreshToken);
    return await tokenData.destroy();
  }

  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateToken(newUser: UserModel) {
    const payload: Payload = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles.map((role) => role.name),
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }),
    };
  }
}

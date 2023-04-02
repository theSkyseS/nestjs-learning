import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshModel } from './refresh-token.model';
import { Module } from '@nestjs/common';

@Module({
  providers: [AuthService],
  imports: [SequelizeModule.forFeature([RefreshModel]), JwtModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

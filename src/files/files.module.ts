import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './files.controller';
import { FilesModel } from './files.model';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService],
  imports: [SequelizeModule.forFeature([FilesModel])],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}

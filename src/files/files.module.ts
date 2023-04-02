import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModel } from './files.model';
import { FilesController } from './files.controller';

@Module({
  providers: [FilesService],
  imports: [SequelizeModule.forFeature([FilesModel])],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}

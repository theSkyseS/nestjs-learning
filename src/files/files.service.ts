import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { Op } from 'sequelize';
import * as uuid from 'uuid';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesModel } from './files.model';

@Injectable()
export class FilesService {
  constructor(@InjectModel(FilesModel) private filesModel: typeof FilesModel) {}

  async createFile(dto: CreateFileDto, file: Express.Multer.File) {
    const fileName = uuid.v4() + path.extname(file.originalname);
    try {
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
    } catch (e) {
      throw new InternalServerErrorException(
        'Произошла ошибка при записи файла',
      );
    }
    return await this.filesModel.create({ fileName, ...dto });
  }

  async removeFile(fileName: string) {
    const filePath = path.resolve(process.cwd(), '..', 'static');
    fs.rm(path.join(filePath, fileName), (err) => {
      if (err) {
        throw new InternalServerErrorException(
          'Произошла ошибка при удалении файла',
        );
      }
    });
    return await this.filesModel.destroy({ where: { fileName } });
  }

  async queueToRemove(fileName: string) {
    return await this.filesModel.update(
      { essenceTable: null, essenceId: null },
      { where: { fileName } },
    );
  }

  async removeUnusedFiles() {
    const files = await this.filesModel.findAll({
      where: {
        createdAt: {
          [Op.gt]: new Date(Date.now() - 60 * 60 * 1000),
        },
        essenceTable: {
          [Op.eq]: null,
        },
        essenceId: {
          [Op.eq]: null,
        },
      },
    });
    const results = [];
    for (const file of files) {
      results.push(this.removeFile(file.fileName));
    }
    return Promise.all(results);
  }
}

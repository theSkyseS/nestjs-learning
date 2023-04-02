import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'files-metadata' })
export class FilesModel extends Model<FilesModel> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  fileName: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  essenceTable: string;

  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: true,
  })
  essenceId: number;
}

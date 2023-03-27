import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserModelCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel, UserModelCreationAttr> {
  @ApiProperty({ description: "User's ID", example: '23' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ description: "User's email", example: 'example@mail.com' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ description: "User's password", example: '1213452' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}

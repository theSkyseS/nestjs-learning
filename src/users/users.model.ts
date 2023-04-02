import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profiles/profiles.model';
import { RoleModel } from 'src/roles/roles.model';
import { UserRolesModel } from 'src/roles/user-roles.model';

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

  @BelongsToMany(() => RoleModel, () => UserRolesModel)
  roles: RoleModel[];

  @HasOne(() => ProfileModel, 'userId')
  profile: ProfileModel;
}

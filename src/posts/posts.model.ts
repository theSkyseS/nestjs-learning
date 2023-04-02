import { Column, DataType, Index, Model, Table } from 'sequelize-typescript';

interface PostCreationAttr {
  searchTitle: string;
  title: string;
  text: string;
  group: string;
  image: string;
}

@Table({ tableName: 'posts' })
export class PostModel extends Model<PostModel, PostCreationAttr> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  searchTitle: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  group: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;
}

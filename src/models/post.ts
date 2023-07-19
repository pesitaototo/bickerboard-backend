import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';

class Post extends Model {
  public id!: number;
  public body!: string;
  public userId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'post'
});

export default Post;
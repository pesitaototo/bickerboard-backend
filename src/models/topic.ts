import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';

class Topic extends Model {}

Topic.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'topic'
});

export default Topic;
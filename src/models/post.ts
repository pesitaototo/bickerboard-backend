import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db'

class Post extends Model {}

Post.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'post'
})

export default Post
const { DataTypes } = require('sequelize');


/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      handle: {
        type: DataTypes.STRING(20),
        validate: {
          is: {
            args: ['^[a-z\d]+$', 'i'],
            msg: 'Username must be alphanumeric'
          },
          max: {
            args: [20],
            msg: 'Username can only be 20 characters'
          },
          min: {
            args: [4],
            msg: 'Username must be at least 4 characters'
          }
        }
      },
      email: {
        type: DataTypes.STRING(320),
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.TEXT,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    })
    await queryInterface.createTable('topics', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    })
    await queryInterface.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    })
    await queryInterface.addColumn('posts', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    })
    await queryInterface.addColumn('posts', 'topic_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'topics', key: 'id' }
    })
    await queryInterface.addColumn('topics', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'user_id')
    await queryInterface.removeColumn('topics', 'user_id')
    await queryInterface.removeColumn('posts', 'topic_id')
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('topics')
    await queryInterface.dropTable('posts')
  }
};

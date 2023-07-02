/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { DataTypes } = require('sequelize');


/* @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context: queryInterface }) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      handle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: ['^[a-z0-9]+$', 'i'],
            msg: 'Username must be alphanumeric'
          },
          max: {
            args: 20,
            msg: 'Username can only be 20 characters'
          },
          min: {
            args: 4,
            msg: 'Username must be at least 4 characters'
          }
        }
      },
      email: {
        type: DataTypes.STRING(320),
        allowNull: false,
        validate: {
          isEmail: true,
        }
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_admin  : {
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
    });
    await queryInterface.createTable('topics', {
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
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    });
    await queryInterface.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    });
    await queryInterface.addColumn(
      'posts', // source model
      'user_id', // name of key being added
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      });
    await queryInterface.addColumn(
      'posts',
      'topic_id',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'topics', key: 'id' }
      });
    await queryInterface.addColumn(
      'topics',
      'user_id',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      });
  },

  async down ({ context: queryInterface }) {
    await queryInterface.removeColumn('posts', 'user_id');
    await queryInterface.removeColumn('topics', 'user_id');
    await queryInterface.removeColumn('posts', 'topic_id');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('topics');
    await queryInterface.dropTable('posts');
  }
};

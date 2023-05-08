'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      handle: {
        type: Sequelize.DataTypes.STRING(20),
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
        type: Sequelize.DataTypes.STRING(320),
        validate: {
          isEmail: true
        }
      },
      passwordHash: {
        type: Sequelize.DataTypes.TEXT,
      },
      isAdmin: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      isEnabled: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true
      }
    })
    await queryInterface.createTable('topics', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    })
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    })
    await queryInterface.addColumn('posts', 'user_id', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    })
    await queryInterface.addColumn('topics', 'post_id', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'topics', key: 'id' }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('topics')
    await queryInterface.dropTable('posts')
  }
};

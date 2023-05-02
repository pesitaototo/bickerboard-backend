import { Sequelize } from "sequelize";

const { DATABASE_URL } = require('./config')

export const sequelize = new Sequelize(DATABASE_URL)
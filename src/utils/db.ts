import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

import { DATABASE_URL } from './config'

// console.log("DATABASE_URL: ", DATABASE_URL);
const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    // await runMigrations()
    console.log(`Connected to database at ${DATABASE_URL}`);
  } catch (err) {
    console.log('FAILED to connect to Database.... ', err);
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: 'src/migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const mgirator = new Umzug(migrationConf)
  const migrations = await mgirator.up()

  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

export { connectToDatabase, sequelize, rollbackMigration}
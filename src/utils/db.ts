import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { DATABASE_URL } from './config';
import bootstrap from '../config/bootstrap';

// console.log("DATABASE_URL: ", DATABASE_URL);
if (!DATABASE_URL) {
  console.log("BAD Database URL: ", DATABASE_URL)
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      await bootstrap();
    } else {
      await runMigrations();
    }
    console.log(`Connected to database at ${DATABASE_URL}`);
  } catch (err) {
    // console.log('FAILED to connect to Database.... ', err);
    throw new Error('FAILED to connect to database: ' + err);
  }

  return null;
};

const migrationConf = {
  migrations: {
    glob: 'src/migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const mgirator = new Umzug(migrationConf);
  const migrations = await mgirator.up();

  // console.log('Migrations up to date', {
  //   files: migrations.map((mig) => mig.name)
  // })
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

export { connectToDatabase, sequelize, rollbackMigration};
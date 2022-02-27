require('dotenv').config();
const fs = require('fs');

const main = () => {
  production_mode = process.env.NODE_ENV === 'production';

  const ormconfig = {
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST || 'localhost',
    port: Number.parseInt(process.env.POSTGRESQL_PORT) || 5432,
    username: process.env.POSTGRESQL_USERNAME || 'wellets',
    password: process.env.POSTGRESQL_PASSWORD || 'wellets',
    database: process.env.POSTGRESQL_DATABASE || 'wellets',
    ssl: process.env.POSTGRESQL_SSL === "true",
    extra: {
      ssl: {
        rejectUnauthorized: process.env.POSTGRESQL_SSL_REJECT_UNAUTHORIZED === "true",
      },
    },
    ...(production_mode
      ? {
          entities: ['./dist/Modules/**/Entities/*.js'],
          migrations: ['./dist/Shared/Infra/TypeORM/Migrations/*.js'],
          cli: {
            migrationsDir: './dist/Shared/Infra/TypeORM/Migrations',
          },
          seeders: ['dist/Shared/Infra/TypeORM/Seeds/*.js'],
        }
      : {
          entities: ['./src/Modules/**/Entities/*.ts'],
          migrations: ['./src/Shared/Infra/TypeORM/Migrations/*.ts'],
          cli: {
            migrationsDir: './src/Shared/Infra/TypeORM/Migrations',
          },
          seeders: ['src/Shared/Infra/TypeORM/Seeds/*.ts'],
        }),
    defaultSeeder: 'RootSeeder',
  };

  fs.writeFileSync('ormconfig.json', JSON.stringify(ormconfig));
};

main();

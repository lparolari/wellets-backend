require('dotenv').config();
const fs = require('fs');

const main = () => {
  // get arguments
  const args = process.argv.slice(2);

  // arg --help
  if (args.includes('--help')) {
    console.log(`
    Usage: genOrmconfig [--dev]
    `);
    return;
  }


  production_mode = process.env.NODE_ENV === 'production';
  ssl = process.env.POSTGRES_SSL === "true";
  ssl_extra = ssl ? {
    ssl: {
      rejectUnauthorized: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === "true",
    }
  } : {}

  const ormconfig = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number.parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USERNAME || 'wellets',
    password: process.env.POSTGRES_PASSWORD || 'wellets',
    database: process.env.POSTGRES_DB || 'wellets',
    ssl: ssl,
    extra: ssl_extra,
    ...(true
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

  console.log(JSON.stringify(ormconfig, null, 4))

  fs.writeFileSync('ormconfig.json', JSON.stringify(ormconfig, null, 4));
};

main();

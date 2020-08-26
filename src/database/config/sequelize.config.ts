import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dialect: process.env.DATABASE_DIALECT,
  port: +process.env.DATABASE_PORT,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  timezone: process.env.DATABASE_TIMEZONE
}));
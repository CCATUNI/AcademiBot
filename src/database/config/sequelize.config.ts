import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dialect: process.env.DB_DIALECT,
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  timezone: process.env.DB_TIMEZONE
}));
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: +process.env.PORT,
  env: process.env.NODE_ENV,
  production: process.env.NODE_ENV === 'production',
  server: process.env.SERVER_URL
}));
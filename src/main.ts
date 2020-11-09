import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { ConfigType } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as rp from 'request-promise';

async function infinitePing(url: string) {
  for (;;) {
    let time = (Math.random() * 60 * 1000) + 1000*15;
    await rp(url);
    await new Promise(resolve => setTimeout(resolve, time));
  }
}


// Developed by Marco Antonio Vela Rodriguez
// mvelar@uni.pe
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.use(morgan("tiny"));
  await app.listen(configService.port);
  console.log(`Running in ${await app.getUrl()} and listening at port ${configService.port}`);
  if (configService.server)
    infinitePing(configService.server)
      .catch(console.error);
}
bootstrap();

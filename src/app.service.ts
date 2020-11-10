import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {
    process.on('SIGTERM', () => {
      sequelize.close()
        .finally(() => process.exit(0));
    })
  }


  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Platform } from '../models/platform.model';

@Injectable()
export class PlatformService {
  constructor(@InjectModel(Platform) private repository: typeof Platform) {}

  findByPk(id: string) {
    return this.repository.findByPk(id, { rejectOnEmpty: true });
  }

}
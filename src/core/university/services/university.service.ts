import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { University } from '../models/university.model';
import { Model } from 'sequelize-typescript';

@Injectable()
export class UniversityService {
  constructor(@InjectModel(University) private repository: typeof University) {}

  findAll(options?: { attributes?: string[], include?: typeof Model[]}) {
    return this.repository.findAll(options);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileAccount } from '../models/file-account.model';
import { CreateFileAccountDto } from '../dto/file-account.dto';

@Injectable()
export class FileAccountService {
  constructor(
    @InjectModel(FileAccount) private repository: typeof FileAccount
  ) {}

  createAccountFinder(platformId: string) {
    return (fileId: number) => {
      return this.repository
        .findOne({ where: { fileId, platformId }, rejectOnEmpty: true });
    }
  }

  create(createData: CreateFileAccountDto) {
    return this.repository.create(createData);
  }
}
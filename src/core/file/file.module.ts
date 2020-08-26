import { Module } from '@nestjs/common';
import { FileResolver } from './resolvers/file.resolver';
import { FileAccountResolver } from './resolvers/file-account.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './models/file.model';
import { FileAccount } from './models/file-account.model';
import { FileService } from './services/file.service';
import { FileAccountService } from './services/file-account.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      File,
      FileAccount
    ])
  ],
  providers: [
    FileResolver,
    FileAccountResolver,
    FileService,
    FileAccountService
  ],
  exports: [SequelizeModule, FileService,FileAccountService]
})
export class FileModule {}

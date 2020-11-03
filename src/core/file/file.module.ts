import { Module } from '@nestjs/common';
import { FileResolver } from './resolvers/file.resolver';
import { FileAccountResolver } from './resolvers/file-account.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './models/file.model';
import { FileAccount } from './models/file-account.model';
import { FileService } from './services/file.service';
import { FileAccountService } from './services/file-account.service';
import { FileController } from './file.controller';
import { FilesystemModule } from '../../filesystem/filesystem.module';
import { FileAction } from './models/file-action.model';
import { FileActionResolver } from './resolvers/file-action.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([
      File,
      FileAccount,
      FileAction,
    ]),
    FilesystemModule
  ],
  providers: [
    FileResolver,
    FileAccountResolver,
    FileService,
    FileAccountService,
    FileActionResolver,
  ],
  exports: [SequelizeModule, FileService, FileAccountService],
  controllers: [FileController]
})
export class FileModule {}

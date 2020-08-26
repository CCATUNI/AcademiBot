import { Module } from '@nestjs/common';
import { PlatformResolver } from './resolvers/platform.resolver';
import { FileSubmissionResolver } from './resolvers/file-submission.resolver';
import { FileRequestResolver } from './resolvers/file-request.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Platform } from './models/platform.model';
import { FileRequest } from './models/file-request.model';
import { FileSubmission } from './models/file-submission.model';
import { PlatformService } from './services/platform.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Platform,
      FileRequest,
      FileSubmission
    ])
  ],
  providers: [
    PlatformResolver,
    FileSubmissionResolver,
    FileRequestResolver,
    PlatformService
  ],
  exports: [SequelizeModule, PlatformService]
})
export class PlatformModule {}

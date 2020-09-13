import { Module } from '@nestjs/common';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';
import { FacebookConfigModule } from './config/facebook-config.module';
import { WebhookProvider } from './webhook.service';
import { UserModule } from '../core/user/user.module';
import { FileModule } from '../core/file/file.module';
import { ConversationModule } from '../conversation/conversation.module';
import { PlatformModule } from '../core/platform/platform.module';
import { UniversityModule } from '../core/university/university.module';
import { StudyMaterialModule } from '../core/study-material/study-material.module';
import { FilesystemModule } from '../filesystem/filesystem.module';
import { facebookConfigConstants } from './config/constants';

@Module({
  imports: [
    FacebookConfigModule,
    UserModule,
    FileModule,
    ConversationModule,
    PlatformModule,
    UniversityModule,
    StudyMaterialModule,
    FilesystemModule
  ],
  controllers: facebookConfigConstants.enableApi ? [FacebookController] : [],
  providers: facebookConfigConstants.enableApi ?
    [FacebookService, WebhookProvider] : [FacebookService],
  exports: [FacebookService]
})
export class FacebookModule {}

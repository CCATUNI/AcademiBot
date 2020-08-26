import { Module } from '@nestjs/common';
import { UniversityModule } from './university/university.module';
import { StudyMaterialModule } from './study-material/study-material.module';
import { FileModule } from './file/file.module';
import { MessageModule } from './message/message.module';
import { PlatformModule } from './platform/platform.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    UniversityModule,
    StudyMaterialModule,
    FileModule,
    MessageModule,
    PlatformModule,
    UserModule
  ]
})
export class CoreModule {}

import { Module } from '@nestjs/common';
import { ActivityTypeResolver } from './resolvers/activity-type.resolver';
import { StudyFileResolver } from './resolvers/study-file.resolver';
import { StudyMaterialResolver } from './resolvers/study-material.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityType } from './models/activity-type.model';
import { StudyFile } from './models/study-file.model';
import { StudyMaterial } from './models/study-material.model';
import { StudyMaterialService } from './services/study-material.service';
import { StudyMaterialController } from './study-material.controller';
import { StudyMaterialRequest } from './models/study-material-request.model';
import { StudyMaterialRequestResolver } from './resolvers/study-material-request.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ActivityType,
      StudyFile,
      StudyMaterial,
      StudyMaterialRequest
    ])
  ],
  providers: [
    ActivityTypeResolver,
    StudyFileResolver,
    StudyMaterialResolver,
    StudyMaterialService,
    StudyMaterialRequestResolver
  ],
  exports: [
    SequelizeModule,
    StudyMaterialService
  ],
  controllers: [StudyMaterialController]
})
export class StudyMaterialModule {}

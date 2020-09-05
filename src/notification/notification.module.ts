import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FacebookModule } from '../facebook/facebook.module';
import { UserModule } from '../core/user/user.module';

@Module({
  imports: [FacebookModule, UserModule],
  providers: [NotificationService]
})
export class NotificationModule {}

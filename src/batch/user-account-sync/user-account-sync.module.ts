import { Module } from '@nestjs/common';
import { UserAccountSyncService } from './user-account-sync.service';
import { FacebookModule } from '../../facebook/facebook.module';
import { UserModule } from '../../core/user/user.module';

@Module({
  imports: [FacebookModule, UserModule],
  providers: [UserAccountSyncService],
  exports: [UserAccountSyncService]
})
export class UserAccountSyncModule {}

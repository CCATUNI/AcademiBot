import { Injectable } from '@nestjs/common';
import { FacebookService } from '../../facebook/facebook.service';
import { UserAccountService } from '../../core/user/services/user-account.service';
import * as cron from 'node-cron';

@Injectable()
export class UserAccountSyncService {
  private running: boolean;
  constructor(
    private facebookService: FacebookService,
    private userAccountService: UserAccountService
  ) {
    this.running = false;
  }
  start(cronExpression) {
    if (this.running)
      throw new Error("Process already running.");
    const valid = cron.validate(cronExpression);
    if (!valid)
      throw new Error(`Cron expression ${cronExpression} not valid.`);
    cron.schedule(cronExpression,() => this.job(), { timezone: 'America/Lima' });
    this.running = true;
  }

  private async job() {
    console.log("STARTING USER ACCOUNT SYNC");
    const accounts = await this.userAccountService
      .findAllForUpdate({ platformId: FacebookService.PLATFORM });
    while (accounts.length) {
      console.log(`Remaining accounts: ${accounts.length}...`);
      await Promise.all(accounts.splice(0, 15).map(async v => {
        try {
          const publicInformation = await this.facebookService
            .getPublicInfo(v.identifierInPlatform);
          await v.update({ publicInformation });
        } catch (e) {
          console.log(`An error ocurred on record ${v.identifierInPlatform} in platform ${FacebookService.PLATFORM}`);
        }
      }))
    }
  }

}

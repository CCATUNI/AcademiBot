import { Injectable } from '@nestjs/common';
import { FacebookService } from '../facebook/facebook.service';
import { UserAccountService } from '../core/user/services/user-account.service';

@Injectable()
export class NotificationService {
  constructor(
    private facebookService: FacebookService,
    private userAccountService: UserAccountService
  ) {}

  async notifyAdmins(text: string) {
    const admins = await this.userAccountService.findAdmins();
    for (const admin of admins) {
      this.facebookService
        .sendText(admin.identifierInPlatform, text, true, true)
        .catch(console.error);
    }
  }



}

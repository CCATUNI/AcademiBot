import { Inject, Injectable } from '@nestjs/common';
import { FileService } from '../../core/file/services/file.service';
import { FacebookService } from '../../facebook/facebook.service';
import { FileAccount } from '../../core/file/models/file-account.model';
import { FileAccountService } from '../../core/file/services/file-account.service';
import { FilesystemService } from '../../filesystem/filesystem.service';
import { File } from '../../core/file/models/file.model';
import * as cron from 'node-cron';
import { Op } from 'sequelize';
import appConfig from '../../config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class FileSyncService {
  private running: boolean;
  constructor(
    private fileService: FileService,
    private fileAccountService: FileAccountService,
    private facebookService: FacebookService,
    private filesystemService: FilesystemService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    this.running = false;
  }

  start(cronExpression) {
    if (this.running)
      throw new Error("Process already running.");
    const valid = cron.validate(cronExpression);
    if (!valid)
      throw new Error(`Cron expression ${cronExpression} not valid.`);
    cron.schedule(cronExpression, () => this.createAccounts(), { timezone: 'America/Lima' });
    this.running = true;
  }

  private async createAccounts() {
    console.log("STARTING SYNC PUBLIC URLS - FACEBOOK");
    await this.createPublicUrls();
    console.log("STARTING SYNC ACCOUNTS")
    const limit = 100;
    let offset = 0;
    // POSSIBLE BUG TO CARE IF REFACTORING
    const publicUrl = { [Op.not]: null } as unknown as string;
    let results = await this.fileService
      .findAll({ publicUrl }, {
        limit,
        offset,
        include: [{ model: FileAccount }]
      });
    while (results.length) {
      console.log(`Offset: ${offset}`);
      offset += limit;
      await Promise.all(results.map(result => this.populateAccounts(result)));
      results = await this.fileService
        .findAll({ publicUrl }, {
          limit,
          offset,
          include: [{ model: FileAccount }]
        });
    }
  }

  private async createPublicUrls() {
    const files = await this.fileService
      .findAll({}, { attributes: ['id', 'filesystemKey'] });
    while (files.length) {
      await Promise.all(files.splice(0, 100).map(async file => {
        const publicUrl = await this.filesystemService.getPublicUrl(file.filesystemKey, 60*60*24*7);
        await file.update({ publicUrl });
      }))
    }
  }

  private async populateAccounts(file: File) {
    const fbAccount = file.accounts
      .find(v => v.platformId === FacebookService.PLATFORM);
    const url = file.getPrivateUrl() ?
      `${this.appConfiguration.server}/file/${file.getPrivateUrl()}` : file.publicUrl;
    const fileType = FacebookService
      .determineAttachmentType(file.contentType);

    if (!fbAccount) {

      const options = {
        fileType,
        platformId: FacebookService.PLATFORM,
        fileId: file.id
      }


      return this.facebookService
        .getAttachmentId({ fileType, url })
        .then(v => v.attachmentId)
        .then(reUtilizationCode => this.fileAccountService.create({...options, reUtilizationCode }))
        .catch(console.error);
    }
    else {
      if (!fbAccount.reUtilizationCode) {
        const options = {
          platformId: FacebookService.PLATFORM,
          fileId: file.id
        }
        return  this.facebookService
          .getAttachmentId({ fileType, url })
          .then(v => v.attachmentId)
          .then(reUtilizationCode => this.fileAccountService.update({...options, reUtilizationCode }, options))
          .catch(console.error);
      }
    }
  }

  private async populatePublicUrl(file: File) {
    const publicUrl = this.filesystemService.getPublicUrl(file.filesystemKey);
    return file.update({ publicUrl })
      .catch(console.error);
  }

}

import { FacebookService } from './facebook.service';
import { WebhookMessage, WebhookPostBack } from './dto/webhook-event.dto';
import { UserAccountService } from '../core/user/services/user-account.service';
import { UserAccount } from '../core/user/models/user-account.model';
import { FacebookConfigService } from './config/facebook-config.service';
import { FileService } from '../core/file/services/file.service';
import { FileAccount } from '../core/file/models/file-account.model';
import { ConversationResponse, ConversationService } from '../conversation/conversation.service';
import { UserService } from '../core/user/services/user.service';
import { UniversityService } from '../core/university/services/university.service';
import { FactoryProvider, Inject } from '@nestjs/common';
import { accountToText, toCard, toQuickReplyButton } from '../common/helpers/facebook-transform';
import { StudyProgramService } from '../core/university/services/study-program.service';
import { StudyPeriodService } from '../core/university/services/study-period.service';
import {
  ERROR_SORRY,
  GET_STUDY_MATERIAL,
  MEME,
  NOT_FOUND,
  PICK_ONE_TEXT,
  SHOW_STUDY_MATERIAL,
  START,
  UPDATE_USER,
  WHOAMI,
} from '../config/constants';
import { StudyMaterialService } from '../core/study-material/services/study-material.service';
import { StudyPlanService } from '../core/university/services/study-plan.service';
import { SorensenFilter } from '../common/helpers/SorensenDice';
import { FileAccountService } from '../core/file/services/file-account.service';
import { PlatformService } from '../core/platform/services/platform.service';
import { Platform } from '../core/platform/models/platform.model';
import { randomElement } from '../common/helpers/array-operations';
import { FileLoaderService } from '../filesystem/file-loader.service';
import { createTicket } from '../common/helpers/ticket-clerk';
import * as fs from 'fs';
import appConfig from '../config/app.config';
import { ConfigType } from '@nestjs/config';
import { FindStudyMaterialArgs } from '../core/study-material/dto/study-material.dto';
import { StudyMaterial } from '../core/study-material/models/study-material.model';

type WebhookContext = {
  account: UserAccount;
  message: WebhookMessage;
  answer: ConversationResponse;
  ended: boolean;
};

type PartialWebhookContext = {
  account: UserAccount;
  answer: ConversationResponse;
  ended: boolean;
  message?: WebhookMessage;
}


export class WebhookService {
  private readonly userAccountFinder: (identifierInPlatform: string) => Promise<UserAccount | null>;
  private readonly fileAccountFinder: (fileId: number) => Promise<FileAccount | null>;
  private readonly studyFileFinder: (findArgs: FindStudyMaterialArgs) => Promise<StudyMaterial>;
  private welcome?: FileAccount;
  public platform?: Platform;
  private readonly server: string;
  constructor(
    private facebookService: FacebookService,
    private userAccountService: UserAccountService,
    private userService: UserService,
    private facebookConfigService: FacebookConfigService,
    private fileService: FileService,
    private conversationService: ConversationService,
    private universityService: UniversityService,
    private studyProgramService: StudyProgramService,
    private studyPeriodService: StudyPeriodService,
    private studyMaterialService: StudyMaterialService,
    private studyPlanService: StudyPlanService,
    private fileAccountService: FileAccountService,
    private platformService: PlatformService,
    private fileLoaderService: FileLoaderService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    this.userAccountFinder = this.userAccountService.createAccountFinder(FacebookService.PLATFORM);
    this.fileAccountFinder = this.fileAccountService.createAccountFinder(FacebookService.PLATFORM);
    this.studyFileFinder = this.studyMaterialService.createMaterialFinder(FacebookService.PLATFORM);
    this.server = this.appConfiguration.server;
  }

  async setup() {
    const config = this.facebookConfigService.getConfiguration();
    this.platform = await this.platformService.findByPk(FacebookService.PLATFORM);
    await this.fileService
      .findOne({ filesystemKey: config.welcomeFileKey })
      .then(file => file.getAccounts())
      .then(accounts => accounts.find(v => v.platformId === FacebookService.PLATFORM))
      .then(v => this.welcome = v)
      .catch(console.error);
  }

  private async getAccount(id: string) {
    let user = await this.userAccountFinder(id);
    if (!user) {
      const publicInformation = await this.facebookService.getPublicInfo(id);
      const createDto = {
        platformId: FacebookService.PLATFORM,
        identifierInPlatform: id,
        publicInformation
      }
      user = await this.userAccountService.create(createDto);
      if (this.welcome) {
        await this.facebookService.sendAttachment(id, this.welcome);
      }
    }
    return user;
  }

  private async receiveAttachment(account: UserAccount, url: string) {
    try {
      const createFileDto = await this.fileLoaderService
        .loadFromUrl(url, `files/`);
      const file = await this.fileService.create(createFileDto);
      return await this.platform.createFileSubmission({
        userId: account.userId,
        fileId: file.id
      });
    } catch (e) {
      await this.platform.createFileSubmission({
        userId: account.userId,
        error: Object(e)
      })
      return e as Error;
    }
  }

  private async receiveAttachments(account: UserAccount, urls: string[]) {
    await Promise.all(urls.map(v => this.receiveAttachment(account, v)));
    const args = {
      quantity: urls.length,
      id: account.id
    };
    const id = account.identifierInPlatform;
    const path = await createTicket(args);
    const createFileDto = await this.fileLoaderService
      .loadFromFile(path, `users/${account.userId}/tickets/`);
    const file = await this.fileService.create(createFileDto);
    await this.platform.createFileSubmission({
      userId: account.userId,
      fileId: file.id
    });
    const readable = fs.createReadStream(path);
    await this.facebookService
      .sendAttachmentFromLocal(id, readable, 'image', createFileDto.contentType);
    return ;
  }

  private async regularizeUser(ctx: PartialWebhookContext): Promise<void> {
    const { account } = ctx;
    const { universityId, studyProgramId, studyPeriodId } = account.user;
    const { courseId, activityTypeId } = account.user;
    const id = account.identifierInPlatform;
    if (!universityId) {
      const cards = (await this.universityService.findAll())
        .map(toCard)
      if (cards.length) {
        await this.facebookService.sendCardsMenu(id, cards);
        ctx.ended = true;
        return ;
      }
    } else if (!studyProgramId) {
      const cards = (await this.studyProgramService
        .findForSending({ universityId }))
        .map(toCard);
      if (cards.length) {
        await this.facebookService.sendCardsMenu(id, cards);
        ctx.ended = true;
        return ;
      }
    } else {
      if (!studyPeriodId) {
        const buttons = (await this.studyPeriodService
          .findForSend({ universityId }))
          .map(toQuickReplyButton);
        if (buttons.length) {
          await this.facebookService.sendQuickReplies(id, PICK_ONE_TEXT, buttons);
          ctx.ended = true;
          return ;
        }
      }
      if (ctx.message) {
        if (!courseId) {
          const includeElectives = account.user.lookingForElectives;
          const studyPlansMatrix = await this.studyPlanService
            .findForUser({ universityId, studyProgramId, studyPeriodId, includeElectives });
          for (const studyPlans of studyPlansMatrix) {
            const stringMatrix = [
              studyPlans.map(v => v.course.id),
              studyPlans.map(v => v.course.title)
            ];
            for (const strings of stringMatrix) {
              const indexes = SorensenFilter(ctx.message.text, strings);
              if (indexes.length) {
                if (indexes.length === 1) {
                  const i = indexes[0];
                  await account.user.setCourse(studyPlans[i].course);
                  return this.regularizeUser(ctx);
                }
                if (indexes.length < 5) {
                  const cards = indexes.map(i => toCard(studyPlans[i].course));
                  await this.facebookService.sendCardsMenu(id, cards);
                  ctx.ended = true;
                  return ;
                }
              }
            }
          }
        } else if (!activityTypeId) {
          const types = await this.studyMaterialService
            .findActivityTypes({ universityId, courseId });
          const stringMatrix = [
            types.map(v => v.id),
            types.map(v => v.name)
          ];
          for (const strings of stringMatrix) {
            const indexes = SorensenFilter(ctx.message.text, strings, 0.90);
            if (indexes.length === 1) {
              const i = indexes[0];
              await account.user.setActivityType(types[i]);
              ctx.answer.payload.command = SHOW_STUDY_MATERIAL;
              return ;
            }
          }
          const buttons = types.map(toQuickReplyButton);
          if (buttons.length) {
            await this.facebookService.sendQuickReplies(id, PICK_ONE_TEXT, buttons);
            ctx.ended = true;
          }
          return ;
        }
      } else {
        if (!courseId) {
          const studyPlans = await this.studyPlanService
            .findValid({ universityId, studyProgramId, studyPeriodId });
          const cards = studyPlans.map(v => toCard(v.course));
          if (cards.length) {
            await this.facebookService.sendCardsMenu(id, cards);
            ctx.ended = true;
          }
        } else if (!activityTypeId) {
          const types = await this.studyMaterialService
            .findActivityTypes({ universityId, courseId });
          const buttons = types.map(toQuickReplyButton);
          if (buttons.length) {
            await this.facebookService.sendQuickReplies(id, PICK_ONE_TEXT, buttons);
            ctx.ended = true;
          }
        }
      }

    }

  }

  private async executeCommand(ctx: PartialWebhookContext) {
    const { answer, account } = ctx;
    const { payload } = answer;
    const command = payload.command;
    let parameters = answer.parameters;
    if (!parameters || JSON.stringify(parameters) === "{}") {
      parameters = payload.parameters;
    }
    const user = account.user;
    const id = account.identifierInPlatform;
    // noinspection FallThroughInSwitchStatementJS
    switch (command) {
      case START:
        await this.userService.clearAll(account.user);
        await this.regularizeUser(ctx);
        return ;
      case UPDATE_USER:
        // Just in case...
        await account.user.update(parameters, {
          fields: [
            'acceptsMassiveMessage',
            'lookingForElectives',
            'universityId',
            'studyProgramId',
            'courseId',
            'studyPeriodId',
            'activityTypeId'
          ]
        });
      case SHOW_STUDY_MATERIAL:
        await this.regularizeUser(ctx);
        if (ctx.ended) return ;
        const find = {
          activityTypeId: user.activityTypeId,
          courseId: user.courseId,
          universityId: user.universityId
        };
        const studyMaterial = await this.studyMaterialService
          .findAll(find);
        if (studyMaterial.length) {
          const buttons = studyMaterial.map(toQuickReplyButton);
          await this.facebookService.sendQuickReplies(id, PICK_ONE_TEXT, buttons);
        } else {
          await user.update({ activityTypeId: null });
          await this.facebookService.sendText(id, NOT_FOUND, false);
          await this.regularizeUser(ctx);
        }
        ctx.ended = true;
        return ;
      case GET_STUDY_MATERIAL:
        const studyMaterialId = parameters.id as string;
        const material = await this
          .studyFileFinder({ id: studyMaterialId });
        await material.createRequest({
          userId: user.id,
          platformId: FacebookService.PLATFORM,
        })
        const studyFiles = material.files
          .filter(v => v.file && v.file.accounts.find(a => a.platformId === FacebookService.PLATFORM));
        const attachments = studyFiles.map(v => {
          const account = v.file.accounts
            .find(a => a.platformId === FacebookService.PLATFORM);
          const url = v.file.getPrivateUrl() ?
            `${this.server}/file/${v.file.getPrivateUrl()}` : v.file.publicUrl;
          return {
            fileType: account.fileType,
            url,
            reUtilizationCode: account.reUtilizationCode
          }
        })
        const results = await this.facebookService.sendSequentialAttachments(id, attachments);
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const values = {
            userId: user.id,
            fileId: studyFiles[i].file.id,
            error: undefined
          };
          if (result instanceof Error) {
            values.error = result;
          }
          this.platform.createFileRequest(values)
            .catch(console.error);
        }
        ctx.ended = true;
        return ;
      default:
        throw new Error("Not supported command " + command);
    }
  }

  private async executePetition(ctx: PartialWebhookContext) {
    const { answer, account } = ctx;
    const { payload } = answer;
    const petition = payload.petition;
    const id = account.identifierInPlatform;
    switch (petition) {
      case WHOAMI:
        await this.facebookService.sendText(id, accountToText(account));
        ctx.ended = true;
        break;
      case MEME:
        const folder = this.facebookConfigService.getConfiguration().memeFolder;
        const memes = await this.fileService
          .findAll(
            { filesystemKey: folder },
            { include: [FileAccount] }
          );
        const randomMeme = randomElement(memes);
        if (randomMeme && randomMeme.accounts) {
          const fbAccount = randomMeme.accounts.find(v => v.platformId === FacebookService.PLATFORM);
          if (fbAccount) {
            await this.facebookService.sendAttachment(id, fbAccount);
            ctx.ended = true;
            return ;
          }
        }
        throw new Error("Petition not fulfilled " + petition);
      default:
        throw new Error("Unsupported petitions: " + petition);
    }
  }

  private async executeAnswer(ctx: PartialWebhookContext) {
    const { answer } = ctx;
    if (!Object.getOwnPropertyNames(answer.payload).length) {
      return ;
    }
    // TODO: Modify dialogflow
    if (answer.payload.command) {
      return this.executeCommand(ctx)
    } else if (answer.payload.petition) {
      return this.executePetition(ctx);
    } else {
      throw new Error("Payload not supported " + JSON.stringify(answer.payload));
    }
  }

  async receivePostback(id: string, postback: WebhookPostBack) {
    if (!this.appConfiguration.production) {
      console.log(postback);
      console.log(postback.payload);
    }

    this.facebookService.markSeen(id)
      .then(() => this.facebookService.typingOn(id))
      .catch(e => console.error(e.message));
    const account = await this.getAccount(id);
    const payload = postback.payload;
    const answer: ConversationResponse = undefined;
    const ctx: PartialWebhookContext = { account, answer, ended: false };

    try {
      ctx.answer = JSON.parse(payload);
      await this.executeAnswer(ctx);
    } catch (e) {
      if (!this.appConfiguration.production) {
        console.error(e);
        ctx.answer = {
          text: e.message,
          payload: {},
          parameters: {}
        }
      }
    }
    if (ctx.answer && ctx.answer.text) {
      try {
        await this.facebookService.sendText(account.identifierInPlatform, ctx.answer.text);
        account
          .createMessage({ textContent: ctx.answer.text, sentByUser: false })
          .catch(console.error);
      } catch (e) {
        account
          .createMessage({ textContent: ctx.answer.text, sentByUser: false, error: Object(e) })
          .catch(console.error);
      }
    }
    return ;
  }

  async receiveMessage(id: string, message: WebhookMessage) {
    if (!this.appConfiguration.production) {
      console.log(message);
      console.log(message.quick_reply);
    }
    this.facebookService.markSeen(id)
      .then(() => this.facebookService.typingOn(id))
      .catch(e => console.error(e.message));
    const text = message.text;
    const account = await this.getAccount(id);
    account
      .createMessage({ textContent: text, sentByUser: true })
      .catch(console.error);
    // Left as not awaited promises on purpose

    if (message.attachments) {
      const urls = message.attachments
        .filter(v => v.payload && v.payload.url && !v.payload.sticker_id)
        .map(v => v.payload.url);
      if (urls.length) {
        await this.receiveAttachments(account, urls);
        return ;
      }
    }

    if (!text) return ;

    const answer: ConversationResponse = undefined;
    const ctx: WebhookContext = { account, message, answer, ended: false };
    //NOTE: Check this
    try {
      if (message.quick_reply) {
        ctx.answer = JSON.parse(message.quick_reply.payload);
      }
      if (!ctx.answer) {
        ctx.answer = await this.conversationService.processText(id, text);
      }
      await this.executeAnswer(ctx);
    } catch (e) {
      if (!this.appConfiguration.production) {
        console.error(e);
        ctx.answer = {
          text: e.message,
          payload: {},
          parameters: {}
        }
      }
    }


    if (ctx.ended) {
      return ;
    }

    if (!ctx.answer) {
      ctx.answer = {
        text: ERROR_SORRY,
        payload: {},
        parameters: {}
      }
    }

    try {
      await this.facebookService.sendText(id, ctx.answer.text, true);
      account
        .createMessage({ textContent: ctx.answer.text, sentByUser: false })
        .catch(console.error);
    } catch (e) {
      account
        .createMessage({ textContent: ctx.answer.text, sentByUser: false, error: Object(e) })
        .catch(console.error);
    }

    return ;
  }
}

export const WebhookProvider: FactoryProvider<Promise<WebhookService>> = {
  provide: WebhookService,
  useFactory: async (
    facebookService: FacebookService,
    userAccountService: UserAccountService,
    userService: UserService,
    facebookConfigService: FacebookConfigService,
    fileService: FileService,
    conversationService: ConversationService,
    universityService: UniversityService,
    studyProgramService: StudyProgramService,
    studyPeriodService: StudyPeriodService,
    studyMaterialService: StudyMaterialService,
    studyPlanService: StudyPlanService,
    fileAccountService: FileAccountService,
    platformService: PlatformService,
    fileLoaderService: FileLoaderService,
    appConfiguration: ConfigType<typeof appConfig>
  ) => {
    const service = new WebhookService(
      facebookService,
      userAccountService,
      userService,
      facebookConfigService,
      fileService,
      conversationService,
      universityService,
      studyProgramService,
      studyPeriodService,
      studyMaterialService,
      studyPlanService,
      fileAccountService,
      platformService,
      fileLoaderService,
      appConfiguration
    );
    await service.setup();
    return service;
  },
  inject: [
    FacebookService,
    UserAccountService,
    UserService,
    FacebookConfigService,
    FileService,
    ConversationService,
    UniversityService,
    StudyProgramService,
    StudyPeriodService,
    StudyMaterialService,
    StudyPlanService,
    FileAccountService,
    PlatformService,
    FileLoaderService,
    appConfig.KEY
  ]
}

import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as rp from 'request-promise';
import execute from 'async-executer/lib/executer';
import { find } from 'linkifyjs';
import { Card } from '../common/interfaces/Cards.interface';
import { FacebookConfigService } from './config/facebook-config.service';
import { QuickReplyButton } from '../common/interfaces/QuickReply.interface';

type Sendable = { url?: string; fileType: string; reUtilizationCode?: string };

type FBResponse = { recipientId: string; messageId: string; attachmentId?: string };

@Injectable()
export class FacebookService {
  public static readonly PLATFORM = 'FACEBOOK';
  public readonly token: string;
  private readonly apiVersion: string;
  private readonly repliesLimit: number;
  private readonly cardsLimit: number;
  private readonly cardsButtonsLimit: number;
  private readonly timeoutForSequentialAttachments: number;
  constructor(private facebookConfigService: FacebookConfigService) {
    const options = facebookConfigService.getConfiguration();
    this.token = options.token;
    this.apiVersion = options.apiVersion;
    this.repliesLimit = options.repliesLimit;
    this.cardsLimit = options.cardsLimit;
    this.cardsButtonsLimit = options.cardsButtonsLimit;
    this.timeoutForSequentialAttachments = options.timeoutForSequentialAttachments;
  }

  getMessageParams() {
    return {
      uri: `https://graph.facebook.com/v${this.apiVersion}/me/messages`,
      qs: { access_token: this.token },
      method: 'POST',
      json: undefined,
      formData: undefined
    };
  }

  async getPublicInfo(psid: string): Promise<object> {
    const params = {
      uri: `https://graph.facebook.com/v${this.apiVersion}/${psid}/`,
      qs: { access_token: this.token },
      method: 'GET'
    };
    return JSON.parse(await rp(params));
  }

  // See more at https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api
  async getAttachmentId(parameters: Sendable) {
    const params = {
      uri: `https://graph.facebook.com/v${this.apiVersion}/me/message_attachments`,
      qs: { access_token: this.token },
      method: 'POST',
      json: {
        message: {
          attachment: {
            type: parameters.fileType,
            payload: {
              is_reusable: true,
              url: parameters.url,
            }
          }
        }
      }
    };
    const response: { attachment_id: string } = await rp(params);
    return { attachmentId: response.attachment_id };
  }

  // See more at https://developers.facebook.com/docs/messenger-platform/send-messages/saving-assets/
  // Se even more at https://developers.facebook.com/docs/messenger-platform/send-messages#sending_attachments
  async sendAttachment(psid: string, parameters: Sendable): Promise<FBResponse> {
    const param = this.getMessageParams();
    param.json = {
      messaging_type: 'RESPONSE',
      recipient: { id: psid },
      message: {
        attachment: {
          type: parameters.fileType,
          payload: {},
        },
      }
    }
    const attachment = param.json.message.attachment;
    if (parameters.reUtilizationCode) {
      attachment.payload['attachment_id'] = parameters.reUtilizationCode;
    } else if (parameters.url) {
      attachment.payload['url'] = parameters.url;
      attachment.payload['is_reusable'] = true;
    }
    try {
      const response = await rp(param);
      return {
        recipientId: response.recipient_id,
        messageId: response.message_id,
        attachmentId: response.attachment_id,
      }
    } catch (e) {
      if (parameters.url){
        console.log("Emergency send");
        await this.sendText(psid, parameters.url, false);
        throw e;
      }
      else
        throw e
    }

  }

  async sendSequentialAttachments(psid: string, parameterList: Sendable[]) {
    const results: Array<
      { recipientId: string; messageId: string; attachmentId?: string } | Error
      > = [];
    const send = async (parameter: Sendable) => {
      try {
        results.push(await this.sendAttachment(psid, parameter));
      } catch (e) {
        results.push(e);
      }
      await this.typingOn(psid);
    };
    await execute(
      send,
      parameterList,
      this.timeoutForSequentialAttachments,
    );
    await this.typingOff(psid);
    return results;
  }

  // See more at https://developers.facebook.com/docs/messenger-platform/reference/templates/open-graph
  async sendUrl(psid: string, url: string, publicity: boolean = false) {
    // TODO: Find appropiate template for url previews, this one will only last until july 29 2021
    const params = {
      uri: `https://graph.facebook.com/v3.3/me/messages`,
      qs: { access_token: this.token },
      method: 'POST',
      json: {
        messaging_type: 'RESPONSE',
        recipient: { id: psid },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'open_graph',
              elements: [{ url }],
            },
          },
        },
      },
    };
    if (publicity) {
      params.json.messaging_type = 'MESSAGE_TAG';
      params.json['tag'] = 'NON_PROMOTIONAL_SUBSCRIPTION';
    }
    const response: { recipient_id: string; message_id: string } = await rp(
      params,
    );
    return {
      recipientId: response.recipient_id,
      messageId: response.message_id,
    };
  }

  async sendText(
    psid: string,
    text: string,
    withUrls: boolean = true,
    publicity: boolean = false,
  ): Promise<FBResponse> {
    const params = this.getMessageParams();
    params.json = {
      messaging_type: 'RESPONSE',
      recipient: { id: psid },
      message: { text },
    }
    if (publicity) {
      params.json.messaging_type = 'MESSAGE_TAG';
      params.json['tag'] = 'NON_PROMOTIONAL_SUBSCRIPTION';
    }
    let response: { recipientId: string; messageId: string };
    if (withUrls) {
      const urls = find(text)
        .filter(value => value.type === 'url')
        .map(value => value.value);
      for (let url of urls) {
        while (text.indexOf(url) > -1) {
          text = text.replace(url, '');
        }
      }
      if (text.length) {
        const response1: {
          recipient_id: string;
          message_id: string;
        } = await rp(params);
        response = {
          recipientId: response1.recipient_id,
          messageId: response1.message_id,
        };
      }
      await execute(
        (link: string) => this.sendUrl(psid, link, publicity),
        urls,
        this.timeoutForSequentialAttachments,
      );
    } else {
      const response1: { recipient_id: string; message_id: string } = await rp(
        params,
      );
      response = {
        recipientId: response1.recipient_id,
        messageId: response1.message_id,
      };
    }
    return response;
  }

  async sendQuickReplies(
    psid: string,
    text: string,
    buttons: QuickReplyButton[],
  ): Promise<FBResponse> {
    buttons = buttons.splice(0, this.repliesLimit);
    if (buttons.length === 0) {
      throw new Error("Zero buttons");
    }
    const params = this.getMessageParams();
    params.json = {
      messaging_type: 'RESPONSE',
      recipient: { id: psid },
      message: { text, quick_replies: buttons }
    }
    const response = await rp(params);
    return {
      recipientId: response.recipient_id,
      messageId: response.message_id,
    };
  }

  async sendCardsMenu(psid: string, parameterList: Card[]): Promise<FBResponse> {
    parameterList = parameterList.splice(0, this.cardsLimit);
    if (parameterList.length === 0) {
      throw new Error('Zero cards.');
    }
    const elements = parameterList.map(value => {
      value.buttons = value.buttons.splice(0, this.cardsButtonsLimit);
      if (value.buttons.length === 0) {
        throw new Error('Zero card buttons.');
      }
      const buttons = value.buttons.map(value1 => {
        return {
          type: 'postback',
          title: value1.title,
          payload: value1.payload,
        };
      });
      return {
        title: value.title,
        buttons,
        subtitle: value.subtitle,
      };
    });
    const params = this.getMessageParams();
    params.json = {
      messaging_type: 'RESPONSE',
      recipient: { id: psid },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements,
          },
        },
      },
    };
    const response = await rp(params);
    return {
      recipientId: response.recipient_id,
      messageId: response.message_id,
    };
  }

  async markSeen(psid: string) {
    return this.sendAction(psid, 'mark_seen');
  }

  async typingOn(psid: string) {
    return this.sendAction(psid, 'typing_on');
  }

  async typingOff(psid: string) {
    return this.sendAction(psid, 'typing_off');
  }

  // See more at https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions
  private async sendAction(
    psid: string,
    action: 'mark_seen' | 'typing_on' | 'typing_off',
  ) {
    const params = this.getMessageParams();
    params.json = {
      recipient: { id: psid },
      sender_action: action
    };
    await rp(params);
  }

  async getOwnInfo() {
    const params = {
      uri: `https://graph.facebook.com/v${this.apiVersion}/me`,
      qs: {
        fields: 'id,name,about,access_token',
        access_token: this.token,
      },
      method: 'GET',
    };
    const response: {
      access_token: string;
      name: string;
      about: string;
      id: string;
    } = JSON.parse(await rp(params));
    return {
      accessToken: response.access_token,
      name: response.name,
      about: response.about,
      id: response.id,
    };
  }

  async sendAttachmentFromLocal(psid: string, file: Readable, type: string, mime: string) {
    const params = this.getMessageParams();
    params.formData = {
      recipient: JSON.stringify({ id: psid }),
      message: JSON.stringify({
        attachment: { type, payload: { is_reusable: false } },
      }),
      type: mime,
      filedata: file
    }
    const response = JSON.parse(await rp(params));
    return {
      messageId: response.message_id,
      recipientId: response.recipient_id,
    };
  }

  static determineAttachmentType(mime: string) {
    const [type] = mime.split('/');
    switch (type) {
      case 'audio':
        return 'audio';
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      default:
        return 'file';
    }
  }
}

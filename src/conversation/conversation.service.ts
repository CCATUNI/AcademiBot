import { DetectIntentRequest, SessionsClient } from 'dialogflow';
import { Injectable } from '@nestjs/common';
import { DialogflowConfigService } from './config/dialogflow-config.service';

export interface ConversationResponse {
  text: string;
  payload: { [p: string]: any };
  parameters: { [p: string]: string };
}

function mapValue(value: {kind: string, [p: string]: any}): any {
  switch (value.kind) {
    case 'stringValue':
      return value['stringValue'];
    case 'structValue':
      const obj = {};
      for (const key in value['structValue'].fields) {
        if (value['structValue'].fields.hasOwnProperty(key))
          obj[key] = mapValue(value['structValue'].fields[key]);
      }
      return obj;
    case 'nullValue':
      return null;
    default:
      return null;
  }
}

@Injectable()
export class ConversationService extends SessionsClient {
  private readonly projectId: string;
  private readonly language: string;

  constructor(private dialogflowConfigService: DialogflowConfigService) {
    super();
    const config = dialogflowConfigService.getConfiguration();
    this.projectId = config.project;
    this.language = config.lang;
  }

  async processText(sessionId: string, text: string,): Promise<ConversationResponse> {
    const sessionPath = this.sessionPath(this.projectId, sessionId);
    const params: DetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: this.language,
        },
      },
    };
    const intents = await this.detectIntent(params);
    // TODO: Investigate why use only the first result
    const intent = intents[0];
    const { fulfillmentMessages, fulfillmentText } = intent.queryResult;

    const payload: { [key: string]: string } = {};
    const parameters: { [key: string]: any } = {};

    let fulfillmentMessage: { [key: string]: any };
    for (const value of fulfillmentMessages) {
      if (
        value.message === 'payload' &&
        value.payload &&
        'fields' in value.payload
      ) {
        fulfillmentMessage = value.payload.fields;
        break;
      }
    }
    if (fulfillmentMessage) {
      for (const key in fulfillmentMessage) {
        payload[key] = mapValue(fulfillmentMessage[key]);
      }
    }
    const fields = intent.queryResult.parameters.fields!;
    if (fields) {
      for (const key in fields) {
        if (fields.hasOwnProperty(key) && 'stringValue' in fields[key]) {
          parameters[key] = fields[key].stringValue;
        }
      }
    }
    return {
      text: fulfillmentText,
      payload,
      parameters,
    };
  }
}

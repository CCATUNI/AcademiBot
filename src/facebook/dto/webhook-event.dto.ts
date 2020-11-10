import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum AttachmentType {
  audio = "audio",
  file = "file",
  image = "image",
  location = "location",
  video = "video",
  fallback = "fallback"
}

export class Payload {
  @IsUrl()
  public url: string;

  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public sticker_id?: string;

  @IsOptional()
  @IsNumber()
  public 'coordinates.lat'?: number;

  @IsOptional()
  @IsNumber()
  public 'coordinates.long'?: number;
}


export class Attachment {
  @IsEnum(AttachmentType)
  public type: AttachmentType;

  @IsObject()
  public payload: Payload;
}

export class QuickReply {
  @IsString()
  public payload: string;
}

export class WebhookMessage {
  @IsString()
  public mid: string;

  @IsOptional()
  @IsString()
  public text?: string;

  @IsOptional()
  @Type(() => QuickReply)
  public quick_reply?: QuickReply;

  @IsOptional()
  @IsObject()
  public reply_to?: { mid: string };

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Attachment)
  public attachments?: Attachment[];

}

//https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_postbacks
export class WebhookPostBack {
  @IsString()
  public title: string;

  @IsString()
  public payload: string;
}


export class Recipient {
  @IsString()
  public id: string;
}

export class Sender {
  @IsString()
  public id: string;
}

export class Messaging {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Sender)
  public sender: Sender;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  public recipient: Recipient;

  @IsNumber()
  public timestamp: number;

  @IsObject()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => WebhookMessage)
  public message?: WebhookMessage;

  @IsObject()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => WebhookPostBack)
  public postback?: WebhookPostBack;
}


export class Entry {
  @IsString()
  public id: string;

  @IsNumber()
  public time: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Messaging)
  public messaging: Messaging[];
}


export class WebhookEventDto {
  @IsString()
  public object: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Entry)
  public entry: Entry[];
}

import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { FacebookConfigService } from './config/facebook-config.service';
import { Response } from 'express';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class FacebookController {
  private readonly verifyToken: string;
  constructor(
    private facebookConfigService: FacebookConfigService,
    private webhookService: WebhookService
  ) {
    const options = this.facebookConfigService.getConfiguration();
    this.verifyToken = options.verifyToken;
  }

  @Get()
  verify(
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string
  ) {
    if (verifyToken === this.verifyToken) {
      return challenge;
    } else {
      throw new HttpException('Wrong token', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  receive(@Body() body: WebhookEventDto, @Res() res: Response) {
    for (const entry of body.entry) {
      for (const messaging of entry.messaging) {
        const id = messaging.sender.id;
        if (messaging.message && messaging.message) {
          this.webhookService.receiveMessage(id, messaging.message)
            .catch(console.error);
        } else if (messaging.postback) {
          this.webhookService.receivePostback(id, messaging.postback)
            .catch(console.error);
        } else {
          console.error(messaging);
          throw new HttpException(body, HttpStatus.BAD_REQUEST);
        }
      }
    }

    res.sendStatus(200);
  }

}

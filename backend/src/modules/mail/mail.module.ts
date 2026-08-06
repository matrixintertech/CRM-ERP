import { Module } from '@nestjs/common';

import { MailService } from './services/mail.service';
import { Msg91WhatsAppService } from './services/msg91-whatsapp.service';

@Module({
  providers: [MailService, Msg91WhatsAppService],

  exports: [MailService, Msg91WhatsAppService],
})
export class MailModule {}

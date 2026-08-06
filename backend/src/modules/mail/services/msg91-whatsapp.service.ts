import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import axios from 'axios';

interface Msg91ErrorResponse {
  message?: string;
  errors?: string;

  error?: {
    message?: string;
  };
}

@Injectable()
export class Msg91WhatsAppService {
  private readonly logger = new Logger(Msg91WhatsAppService.name);

  async sendLoginOtp(mobile: string, otp: string): Promise<void> {
    const authKey = process.env.MSG91_AUTH_KEY;

    const apiUrl = process.env.MSG91_WHATSAPP_API_URL;

    const integratedNumber = process.env.MSG91_WHATSAPP_INTEGRATED_NUMBER;

    const templateName =
      process.env.MSG91_WHATSAPP_TEMPLATE_NAME ?? 'otp_verification';

    const languageCode =
      process.env.MSG91_WHATSAPP_TEMPLATE_LANGUAGE ?? 'en_US';

    if (!authKey || !apiUrl || !integratedNumber) {
      throw new InternalServerErrorException(
        'MSG91 WhatsApp configuration is incomplete.',
      );
    }

    const normalizedMobile = this.normalizeMobile(mobile);

    const payload = {
      integrated_number: integratedNumber,

      content_type: 'template',

      payload: {
        messaging_product: 'whatsapp',

        type: 'template',

        template: {
          name: templateName,

          language: {
            code: languageCode,

            policy: 'deterministic',
          },

          to_and_components: [
            {
              to: [normalizedMobile],

              components: {
                body_1: {
                  type: 'text',

                  value: otp,
                },

                button_1: {
                  subtype: 'url',

                  type: 'text',

                  value: otp,
                },
              },
            },
          ],
        },
      },
    };

    try {
      await axios.post(apiUrl, payload, {
        headers: {
          authkey: authKey,

          'Content-Type': 'application/json',
        },

        timeout: 15000,
      });
    } catch (error) {
      if (axios.isAxiosError<Msg91ErrorResponse>(error)) {
        const message =
          error.response?.data?.errors ??
          error.response?.data?.error?.message ??
          error.response?.data?.message ??
          error.message;

        this.logger.error(`MSG91 WhatsApp OTP failed: ${message}`);

        this.logger.debug(JSON.stringify(error.response?.data));

        throw new BadGatewayException(message);
      }

      throw new BadGatewayException('Unable to send WhatsApp OTP.');
    }
  }

  private normalizeMobile(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 10) {
      return `91${digits}`;
    }

    if (digits.length === 12 && digits.startsWith('91')) {
      return digits;
    }

    throw new BadGatewayException('Invalid WhatsApp mobile number.');
  }
}

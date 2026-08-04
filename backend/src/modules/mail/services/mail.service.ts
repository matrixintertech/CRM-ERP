import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor() {
    this.transporter =
      nodemailer.createTransport({
        host:
          process.env.SMTP_HOST,

        port:
          Number(
            process.env.SMTP_PORT ??
              587,
          ),

        secure:
          process.env.SMTP_SECURE ===
          'true',

        auth: {
          user:
            process.env.SMTP_USER,

          pass:
            process.env.SMTP_PASSWORD,
        },
      });
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:
          process.env.SMTP_FROM ??
          process.env.SMTP_USER,

        to,

        subject,

        html,
      });
    } catch (error) {
      console.error(
        'Mail sending failed:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to send email.',
      );
    }
  }

  async sendLoginOtp(data: {
    to: string;
    displayName: string;
    otp: string;
    expiresInMinutes: number;
  }): Promise<void> {
    await this.sendMail(
      data.to,
      'Your login OTP',
      `
        <div style="font-family: Arial, sans-serif;">
          <h2>Login OTP</h2>

          <p>Hello ${data.displayName},</p>

          <p>Your OTP for login is:</p>

          <h1 style="letter-spacing: 6px;">
            ${data.otp}
          </h1>

          <p>
            This OTP will expire in
            ${data.expiresInMinutes} minutes.
          </p>

          <p>
            Do not share this OTP with anyone.
          </p>
        </div>
      `,
    );
  }

  async sendResetPasswordOtp(data: {
    to: string;
    displayName: string;
    otp: string;
    expiresInMinutes: number;
  }): Promise<void> {
    await this.sendMail(
      data.to,
      'Password reset OTP',
      `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset OTP</h2>

          <p>Hello ${data.displayName},</p>

          <p>Your password reset OTP is:</p>

          <h1 style="letter-spacing: 6px;">
            ${data.otp}
          </h1>

          <p>
            This OTP will expire in
            ${data.expiresInMinutes} minutes.
          </p>

          <p>
            If you did not request this,
            you can ignore this email.
          </p>
        </div>
      `,
    );
  }
}
import { createHash, randomInt } from 'node:crypto';
import { OTP_EXPIRY_MINUTES } from '../constants/otp.constants';

export class OtpUtil {
  static generate(): string {
    return randomInt(100000, 1000000).toString();
  }

  static hash(otp: string): string {
    return createHash('sha256')
      .update(otp)
      .digest('hex');
  }

  static compare(otp: string, hash: string): boolean {
    return this.hash(otp) === hash;
  }

  static expiry(): Date {
    const expiresAt = new Date();

    expiresAt.setMinutes(
      expiresAt.getMinutes() + OTP_EXPIRY_MINUTES,
    );

    return expiresAt;
  }
}
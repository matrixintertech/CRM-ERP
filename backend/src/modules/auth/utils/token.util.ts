import { createHash } from 'node:crypto';

export class TokenUtil {
  static hash(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }
}
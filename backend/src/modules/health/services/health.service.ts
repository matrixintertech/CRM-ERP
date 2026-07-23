import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'UP',
      service: 'Matrix CRM API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
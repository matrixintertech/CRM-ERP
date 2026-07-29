import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientRepository } from './repositories/client.repository';

import { StateModule } from '../master/state/state.module';
import { CityModule } from '../master/city/city.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule,
    AuthModule,
    StateModule,
    CityModule,
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
    ClientRepository,
  ],
  exports: [
    ClientService,
    ClientRepository,
  ],
})
export class ClientModule {}
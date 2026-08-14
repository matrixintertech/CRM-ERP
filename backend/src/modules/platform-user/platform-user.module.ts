import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';

import { AuthorizationModule } from '../authorization/authorization.module';
import { PlatformRoleModule } from '../platform-roles/platform-role.module';

import { PlatformUserController } from './controllers/platform-user.controller';

import { PlatformUserRepository } from './repositories/platform-user.repository';

import { PlatformUserService } from './services/platform-user.service';


@Module({
  imports: [
    PrismaModule,
    AuthorizationModule,
    PlatformRoleModule,
  ],

  controllers: [
    PlatformUserController,
  ],

  providers: [
    PlatformUserService,
    PlatformUserRepository,
  ],

  exports: [
    PlatformUserService,
  ],
})
export class PlatformUserModule {}
import { Module } from "@nestjs/common";

import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';

import { StateController } from "./controllers/state.controller";
import { StateRepository } from "./repositories/state.repository";
import { StateService } from "./services/state.service";

@Module({
  imports: [PrismaModule],
  controllers: [StateController],
  providers: [
    StateService,
    StateRepository,
  ],
  exports: [
    StateService,
    StateRepository,
  ],
})
export class StateModule {}
import { Module } from "@nestjs/common";

import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';

import { CityController } from "./controllers/city.controller";
import { CityRepository } from "./repositories/city.repository";
import { CityService } from "./services/city.service";

@Module({
  imports: [PrismaModule],
  controllers: [CityController],
  providers: [
    CityService,
    CityRepository,
  ],
  exports: [
    CityService,
    CityRepository,
  ],
})
export class CityModule {}
import { Module } from "@nestjs/common";

import { PrismaModule } from 'src/database/prisma.module';

import { DepartmentController } from "./controllers/department.controller";
import { DepartmentRepository } from "./repositories/department.repository";
import { DepartmentService } from "./services/department.service";

@Module({
  imports: [PrismaModule],
  controllers: [DepartmentController],
  providers: [
    DepartmentRepository,
    DepartmentService,
  ],
  exports: [DepartmentRepository],
})
export class DepartmentModule {}
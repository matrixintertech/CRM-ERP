import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";

import { CreateDesignationDto } from "../dto/create-designation.dto";
import { UpdateDesignationDto } from "../dto/update-designation.dto";
import { DesignationService } from "../services/designation.service";

@ApiTags("Designation")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("designations")
export class DesignationController {
  constructor(
    private readonly designationService: DesignationService,
  ) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() dto: CreateDesignationDto,
  ) {
    return this.designationService.create(
      Number((req.user as any).companyId),
      dto,
    );
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.designationService.findAll(
      Number((req.user as any).companyId),
    );
  }

  @Get(":id")
  findOne(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.designationService.findOne(
      Number((req.user as any).companyId),
      id,
    );
  }

  @Patch(":id")
  update(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDesignationDto,
  ) {
    return this.designationService.update(
      Number((req.user as any).companyId),
      id,
      dto,
    );
  }

  @Delete(":id")
  delete(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.designationService.delete(
      Number((req.user as any).companyId),
      id,
    );
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiParam,
  ApiTags,
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
    private readonly designationService:
      DesignationService,
  ) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() dto: CreateDesignationDto,
  ) {
    return this.designationService.create(
      (req.user as any).companyId,
      dto,
    );
  }

  @Get()
  findAll(
    @Req() req: Request,
  ) {
    return this.designationService.findAll(
      (req.user as any).companyId,
    );
  }

  @Get(":uuid")
  @ApiParam({
    name: "uuid",
    type: String,
  })
  findOne(
    @Req() req: Request,
    @Param("uuid") uuid: string,
  ) {
    return this.designationService.findByUuid(
      (req.user as any).companyId,
      uuid,
    );
  }

  @Patch(":uuid")
  @ApiParam({
    name: "uuid",
    type: String,
  })
  update(
    @Req() req: Request,
    @Param("uuid") uuid: string,
    @Body() dto: UpdateDesignationDto,
  ) {
    return this.designationService.updateByUuid(
      (req.user as any).companyId,
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @ApiParam({
    name: "uuid",
    type: String,
  })
  delete(
    @Req() req: Request,
    @Param("uuid") uuid: string,
  ) {
    return this.designationService.deleteByUuid(
      (req.user as any).companyId,
      uuid,
    );
  }
}
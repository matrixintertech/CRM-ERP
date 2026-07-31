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
import type { Request } from "express";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { CreateDepartmentDto } from "../dto/create-department.dto";
import { UpdateDepartmentDto } from "../dto/update-department.dto";
import { DepartmentService } from "../services/department.service";

@ApiTags("Department")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard("jwt"))
@Controller("departments")
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create Department" })
  @ApiResponse({
    status: 201,
    description: "Department created successfully.",
  })
  create(
    @Req() req: Request,
    @Body() dto: CreateDepartmentDto,
  ) {
    return this.departmentService.create(
      Number((req.user as any).companyId),
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: "Get All Departments" })
  @ApiResponse({
    status: 200,
    description: "Departments fetched successfully.",
  })
  findAll(@Req() req: Request) {
    return this.departmentService.findAll(
      Number((req.user as any).companyId),
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Department By Id" })
  @ApiResponse({
    status: 200,
    description: "Department fetched successfully.",
  })
  findOne(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.departmentService.findOne(
      Number((req.user as any).companyId),
      id,
    );
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update Department" })
  @ApiResponse({
    status: 200,
    description: "Department updated successfully.",
  })
  update(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(
      Number((req.user as any).companyId),
      id,
      dto,
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete Department" })
  @ApiResponse({
    status: 200,
    description: "Department deleted successfully.",
  })
  remove(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.departmentService.delete(
      Number((req.user as any).companyId),
      id,
    );
  }
}
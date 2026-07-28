import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ModuleService } from '../services/module.service';

import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@ApiTags('Modules')
@ApiBearerAuth()
@Controller('modules')
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Module',
  })
  @ApiResponse({
    status: 201,
    description:
      'Module created successfully.',
  })
  create(
    @Body()
    dto: CreateModuleDto,
  ) {
    return this.moduleService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Module List',
  })
  @ApiResponse({
    status: 200,
    description:
      'Modules fetched successfully.',
  })
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Module Details',
  })
  @ApiResponse({
    status: 200,
    description:
      'Module fetched successfully.',
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Module',
  })
  @ApiResponse({
    status: 200,
    description:
      'Module updated successfully.',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateModuleDto,
  ) {
    return this.moduleService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Module',
  })
  @ApiResponse({
    status: 200,
    description:
      'Module deleted successfully.',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.moduleService.remove(id);
  }
}
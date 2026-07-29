import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import {
  CreateStateDto,
  StateDropdownDto,
  StateQueryDto,
  UpdateStateDto,
} from "../dto";

import { StateService } from "../services/state.service";

@ApiTags("Master - States")
@ApiBearerAuth()
@Controller("master/states")
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create state" })
  create(
    @Body() dto: CreateStateDto,
  ) {
    return this.stateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all states" })
  findAll(
    @Query() query: StateQueryDto,
  ) {
    return this.stateService.findAll(query);
  }

  @Get("dropdown")
  @ApiOperation({
    summary: "Get states dropdown",
  })
  findDropdown(
    @Query() query: StateDropdownDto,
  ) {
    return this.stateService.findDropdown(query);
  }

  @Get(":uuid")
  @ApiOperation({
    summary: "Get state by UUID",
  })
  findByUuid(
    @Param("uuid") uuid: string,
  ) {
    return this.stateService.findByUuid(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update state" })
  update(
    @Param("uuid") uuid: string,
    @Body() dto: UpdateStateDto,
  ) {
    return this.stateService.update(
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Delete state" })
  remove(
    @Param("uuid") uuid: string,
  ) {
    return this.stateService.remove(uuid);
  }
}
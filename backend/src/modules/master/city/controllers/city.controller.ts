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
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { CityService } from "../services/city.service";

import {
  CityDropdownDto,
  CityQueryDto,
  CreateCityDto,
  UpdateCityDto,
} from "../dto";

@ApiTags("Master - City")
@Controller("master/cities")
export class CityController {
  constructor(
    private readonly cityService: CityService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create city",
  })
  create(
    @Body()
    dto: CreateCityDto,
  ) {
    return this.cityService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: "Get all cities",
  })
  findAll(
    @Query()
    query: CityQueryDto,
  ) {
    return this.cityService.findAll(query);
  }

  @Get("dropdown")
  @ApiOperation({
    summary: "City dropdown",
  })
  findDropdown(
    @Query()
    query: CityDropdownDto,
  ) {
    return this.cityService.findDropdown(query);
  }

  @Get(":uuid")
  @ApiOperation({
    summary: "Get city by UUID",
  })
  findByUuid(
    @Param("uuid")
    uuid: string,
  ) {
    return this.cityService.findByUuid(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({
    summary: "Update city",
  })
  update(
    @Param("uuid")
    uuid: string,

    @Body()
    dto: UpdateCityDto,
  ) {
    return this.cityService.update(
      uuid,
      dto,
    );
  }

  @Delete(":uuid")
  @ApiOperation({
    summary: "Delete city",
  })
  remove(
    @Param("uuid")
    uuid: string,
  ) {
    return this.cityService.remove(uuid);
  }
}
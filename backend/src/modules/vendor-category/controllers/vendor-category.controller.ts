import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import {
  AuthGuard,
} from "@nestjs/passport";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import {
  PermissionGuard,
} from "../../authorization/guards/permission.guard";

import {
  RequirePermission,
} from "../../authorization/decorators/require-permission.decorator";

import {
  CreateVendorCategoryDto,
  UpdateVendorCategoryDto,
  UpdateVendorCategoryStatusDto,
  VendorCategoryQueryDto,
} from "../dto";

import {
  VendorCategoryService,
} from "../services/vendor-category.service";


@ApiTags("Platform Vendor Categories")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("platform/vendor-categories")
export class VendorCategoryController {
  constructor(
    private readonly vendorCategoryService:
      VendorCategoryService,
  ) {}


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  @Post()
  @RequirePermission(
    "platform.vendor_category.create",
  )
  @ApiOperation({
    summary:
      "Create vendor category",
  })
  create(
    @Body()
    dto:
      CreateVendorCategoryDto,
  ) {
    return this.vendorCategoryService
      .create(
        dto,
      );
  }


  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  @Get()
  @RequirePermission(
    "platform.vendor_category.view",
  )
  @ApiOperation({
    summary:
      "Get vendor categories",
  })
  findAll(
    @Query()
    query:
      VendorCategoryQueryDto,
  ) {
    return this.vendorCategoryService
      .findAll(
        query,
      );
  }


  /*
   * =========================================================
   * DETAIL
   * =========================================================
   */

  @Get(
    ":categoryUuid",
  )
  @RequirePermission(
    "platform.vendor_category.view",
  )
  @ApiOperation({
    summary:
      "Get vendor category details",
  })
  @ApiParam({
    name:
      "categoryUuid",

    description:
      "Vendor Category UUID",
  })
  findOne(
    @Param(
      "categoryUuid",
    )
    categoryUuid:
      string,
  ) {
    return this.vendorCategoryService
      .findOne(
        categoryUuid,
      );
  }


  /*
   * =========================================================
   * UPDATE
   * =========================================================
   */

  @Patch(
    ":categoryUuid",
  )
  @RequirePermission(
    "platform.vendor_category.update",
  )
  @ApiOperation({
    summary:
      "Update vendor category",
  })
  @ApiParam({
    name:
      "categoryUuid",

    description:
      "Vendor Category UUID",
  })
  update(
    @Param(
      "categoryUuid",
    )
    categoryUuid:
      string,

    @Body()
    dto:
      UpdateVendorCategoryDto,
  ) {
    return this.vendorCategoryService
      .update(
        categoryUuid,
        dto,
      );
  }


  /*
   * =========================================================
   * UPDATE STATUS
   * =========================================================
   */

  @Patch(
    ":categoryUuid/status",
  )
  @RequirePermission(
    "platform.vendor_category.update",
  )
  @ApiOperation({
    summary:
      "Update vendor category status",
  })
  @ApiParam({
    name:
      "categoryUuid",

    description:
      "Vendor Category UUID",
  })
  updateStatus(
    @Param(
      "categoryUuid",
    )
    categoryUuid:
      string,

    @Body()
    dto:
      UpdateVendorCategoryStatusDto,
  ) {
    return this.vendorCategoryService
      .updateStatus(
        categoryUuid,
        dto.status,
      );
  }


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  @Delete(
    ":categoryUuid",
  )
  @RequirePermission(
    "platform.vendor_category.delete",
  )
  @ApiOperation({
    summary:
      "Delete vendor category",
  })
  @ApiParam({
    name:
      "categoryUuid",

    description:
      "Vendor Category UUID",
  })
  remove(
    @Param(
      "categoryUuid",
    )
    categoryUuid:
      string,
  ) {
    return this.vendorCategoryService
      .remove(
        categoryUuid,
      );
  }
}
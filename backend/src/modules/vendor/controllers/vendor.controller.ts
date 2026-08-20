import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
  CreateVendorDto,
  UpdateVendorCategoriesDto,
  UpdateVendorDto,
  VendorQueryDto,
} from "../dto";

import {
  VendorService,
} from "../services/vendor.service";


@ApiTags("Vendors")
@ApiBearerAuth("access-token")
@UseGuards(
  AuthGuard("jwt"),
  PermissionGuard,
)
@Controller("platform/vendors")
export class VendorController {
  constructor(
    private readonly vendorService:
      VendorService,
  ) {}


  /*
   * =========================================================
   * CREATE GLOBAL VENDOR
   * =========================================================
   */
  @Post()
  @RequirePermission(
    "platform.vendor.create",
  )
  @ApiOperation({
    summary:
      "Create global vendor",
  })
  create(
    @Body()
    dto:
      CreateVendorDto,
  ) {
    return this.vendorService
      .create(
        dto,
      );
  }


  /*
   * =========================================================
   * LIST GLOBAL VENDORS
   * =========================================================
   */
  @Get()
  @RequirePermission(
    "platform.vendor.view",
  )
  @ApiOperation({
    summary:
      "Get global vendors",
  })
  findAll(
    @Query()
    query:
      VendorQueryDto,
  ) {
    return this.vendorService
      .findAll(
        query,
      );
  }


  /*
   * =========================================================
   * GET VENDOR CATEGORIES
   * =========================================================
   */
  @Get(
    ":vendorUuid/categories",
  )
  @RequirePermission(
    "platform.vendor.view",
  )
  @ApiOperation({
    summary:
      "Get vendor categories",
  })
  @ApiParam({
    name:
      "vendorUuid",

    description:
      "Vendor UUID",
  })
  getCategories(
    @Param(
      "vendorUuid",
    )
    vendorUuid:
      string,
  ) {
    return this.vendorService
      .getCategories(
        vendorUuid,
      );
  }


  /*
   * =========================================================
   * UPDATE / REPLACE VENDOR CATEGORIES
   * =========================================================
   */
  @Put(
    ":vendorUuid/categories",
  )
  @RequirePermission(
    "platform.vendor.update",
  )
  @ApiOperation({
    summary:
      "Update vendor categories",
  })
  @ApiParam({
    name:
      "vendorUuid",

    description:
      "Vendor UUID",
  })
  updateCategories(
    @Param(
      "vendorUuid",
    )
    vendorUuid:
      string,

    @Body()
    dto:
      UpdateVendorCategoriesDto,
  ) {
    return this.vendorService
      .updateCategories(
        vendorUuid,
        dto,
      );
  }


  /*
   * =========================================================
   * VENDOR DETAIL
   * =========================================================
   */
  @Get(
    ":vendorUuid",
  )
  @RequirePermission(
    "platform.vendor.view",
  )
  @ApiOperation({
    summary:
      "Get global vendor details",
  })
  @ApiParam({
    name:
      "vendorUuid",

    description:
      "Vendor UUID",
  })
  findOne(
    @Param(
      "vendorUuid",
    )
    vendorUuid:
      string,
  ) {
    return this.vendorService
      .findOne(
        vendorUuid,
      );
  }


  /*
   * =========================================================
   * UPDATE GLOBAL VENDOR
   * =========================================================
   */
  @Patch(
    ":vendorUuid",
  )
  @RequirePermission(
    "platform.vendor.update",
  )
  @ApiOperation({
    summary:
      "Update global vendor",
  })
  @ApiParam({
    name:
      "vendorUuid",

    description:
      "Vendor UUID",
  })
  update(
    @Param(
      "vendorUuid",
    )
    vendorUuid:
      string,

    @Body()
    dto:
      UpdateVendorDto,
  ) {
    return this.vendorService
      .update(
        vendorUuid,
        dto,
      );
  }


  /*
   * =========================================================
   * SOFT DELETE GLOBAL VENDOR
   * =========================================================
   */
  @Delete(
    ":vendorUuid",
  )
  @RequirePermission(
    "platform.vendor.delete",
  )
  @ApiOperation({
    summary:
      "Delete global vendor",
  })
  @ApiParam({
    name:
      "vendorUuid",

    description:
      "Vendor UUID",
  })
  remove(
    @Param(
      "vendorUuid",
    )
    vendorUuid:
      string,
  ) {
    return this.vendorService
      .remove(
        vendorUuid,
      );
  }
}
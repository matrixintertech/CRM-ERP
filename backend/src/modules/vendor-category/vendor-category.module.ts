import {
  Module,
} from "@nestjs/common";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  VendorCategoryController,
} from "./controllers/vendor-category.controller";

import {
  VendorCategoryService,
} from "./services/vendor-category.service";

import {
  VendorCategoryRepository,
} from "./repositories/vendor-category.repository";


@Module({
  imports: [
    AuthorizationModule,
  ],

  controllers: [
    VendorCategoryController,
  ],

  providers: [
    VendorCategoryService,
    VendorCategoryRepository,
  ],

  exports: [
    VendorCategoryService,
    VendorCategoryRepository,
  ],
})
export class VendorCategoryModule {}
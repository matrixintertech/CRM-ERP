import {
  Module,
} from "@nestjs/common";

import {
  AuthorizationModule,
} from "../authorization/authorization.module";

import {
  VendorController,
} from "./controllers/vendor.controller";

import {
  VendorService,
} from "./services/vendor.service";

import {
  VendorRepository,
} from "./repositories/vendor.repository";


@Module({
  imports: [
    AuthorizationModule,
  ],

  controllers: [
    VendorController,
  ],

  providers: [
    VendorService,
    VendorRepository,
  ],

  exports: [
    VendorService,
    VendorRepository,
  ],
})
export class VendorModule {}
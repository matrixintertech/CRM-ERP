import {
  Module,
} from "@nestjs/common";


import {
  PrismaModule,
} from "src/database/prisma.module";


import {
  AuthorizationModule,
} from "../authorization/authorization.module";


import {
  CompanyController,
} from "./controllers/company.controller";

import {
  PlatformCompanyController,
} from "./controllers/platform-company.controller";


import {
  CompanyService,
} from "./services/company.service";

import {
  CompanyAdminService,
} from "./services/company-admin.service";


import {
  CompanyRepository,
} from "./repositories/company.repository";


import {
  UserModule,
} from "../user/user.module";

import {
  CompanySubscriptionModule,
} from "../company-subscription/company-subscription.module";


@Module({
  imports: [
    PrismaModule,

    AuthorizationModule,

    UserModule,

    CompanySubscriptionModule,
  ],


  controllers: [
    CompanyController,

    PlatformCompanyController,
  ],


  providers: [
    CompanyService,

    CompanyAdminService,

    CompanyRepository,
  ],


  exports: [
    CompanyService,

    CompanyRepository,
  ],
})
export class CompanyModule {}
import {
  PartialType,
} from "@nestjs/swagger";

import {
  CreateEmployeeUserAccountDto,
} from "./create-employee-user-account.dto";

export class UpdateEmployeeUserAccountDto extends PartialType(
  CreateEmployeeUserAccountDto,
) {}
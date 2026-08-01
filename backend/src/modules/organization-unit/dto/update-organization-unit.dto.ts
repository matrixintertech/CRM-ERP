import {
  OmitType,
  PartialType,
} from "@nestjs/swagger";

import {
  CreateOrganizationUnitDto,
} from "./create-organization-unit.dto";

export class UpdateOrganizationUnitDto extends PartialType(
  OmitType(
    CreateOrganizationUnitDto,
    ["companyUuid"] as const,
  ),
) {}
import {
  PartialType,
} from "@nestjs/swagger";

import {
  AssignProjectMemberDto,
} from "./assign-project-member.dto";

export class UpdateProjectMemberDto extends PartialType(
  AssignProjectMemberDto,
) {}
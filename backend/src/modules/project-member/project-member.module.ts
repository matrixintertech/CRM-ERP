import {
  Module,
} from "@nestjs/common";

import {
  ProjectMemberController,
} from "./controllers/project-member.controller";

import {
  ProjectMemberRepository,
} from "./repositories/project-member.repository";

import {
  ProjectMemberService,
} from "./services/project-member.service";

@Module({
  controllers: [
    ProjectMemberController,
  ],

  providers: [
    ProjectMemberService,
    ProjectMemberRepository,
  ],

  exports: [
    ProjectMemberService,
    ProjectMemberRepository,
  ],
})
export class ProjectMemberModule {}
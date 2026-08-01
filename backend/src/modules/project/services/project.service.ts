import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  UserType,
} from '@prisma/client';

import { CityRepository } from 'src/modules/master/city/repositories/city.repository';
import { StateRepository } from 'src/modules/master/state/repositories/state.repository';
import { ClientRepository } from 'src/modules/client/repositories/client.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';

import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from '../dto';

import { ProjectRepository } from '../repositories/project.repository';

interface AuthUser {
  id: bigint;
  companyId: bigint | null;
  userType: UserType;
}

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository:
      ProjectRepository,

    private readonly clientRepository:
      ClientRepository,

    private readonly stateRepository:
      StateRepository,

    private readonly cityRepository:
      CityRepository,

    private readonly companyRepository:
      CompanyRepository,
  ) {}

  private isPlatformOwner(
    user: AuthUser,
  ): boolean {
    return (
      user.userType ===
      UserType.PLATFORM_OWNER
    );
  }

  private getUserCompanyId(
    user: AuthUser,
  ): bigint {
    if (!user.companyId) {
      throw new ForbiddenException(
        'Company context is missing.',
      );
    }

    return user.companyId;
  }

  private async resolveCompanyId(
    user: AuthUser,
    companyUuid?: string,
  ): Promise<bigint> {
    if (!this.isPlatformOwner(user)) {
      return this.getUserCompanyId(user);
    }

    if (!companyUuid) {
      throw new BadRequestException(
        'Company is required for platform owner.',
      );
    }

    const company =
      await this.companyRepository.findByUuid(
        companyUuid,
      );

    if (!company) {
      throw new NotFoundException(
        'Company not found.',
      );
    }

    return company.id;
  }

  private async resolveLocationIds(
    stateUuid?: string,
    cityUuid?: string,
  ) {
    let stateId: bigint | undefined;
    let cityId: bigint | undefined;

    if (stateUuid) {
      const state =
        await this.stateRepository.findByUuid(
          stateUuid,
        );

      if (!state) {
        throw new NotFoundException(
          'State not found.',
        );
      }

      stateId = state.id;
    }

    if (cityUuid) {
      const city =
        await this.cityRepository.findByUuid(
          cityUuid,
        );

      if (!city) {
        throw new NotFoundException(
          'City not found.',
        );
      }

      if (
        stateId &&
        city.stateId !== stateId
      ) {
        throw new BadRequestException(
          'Selected city does not belong to the selected state.',
        );
      }

      cityId = city.id;
    }

    return {
      stateId,
      cityId,
    };
  }

  private async generateSRN(
    companyId: bigint,
  ): Promise<string> {
    const year =
      new Date().getFullYear();

    const total =
      await this.projectRepository.count(
        companyId,
      );

    return `SRN-${year}-${String(
      total + 1,
    ).padStart(4, '0')}`;
  }

  async create(
    user: AuthUser,
    dto: CreateProjectDto,
  ) {
    const {
      companyUuid,
      clientUuid,
      stateUuid,
      cityUuid,
      ...projectData
    } = dto;

    const companyId =
      await this.resolveCompanyId(
        user,
        companyUuid,
      );

    /*
     * Client must belong to the selected
     * or logged-in company.
     */
    const client =
      await this.clientRepository.findByUuid(
        companyId,
        clientUuid,
      );

    if (!client) {
      throw new NotFoundException(
        'Client not found for this company.',
      );
    }

    const {
      stateId,
      cityId,
    } = await this.resolveLocationIds(
      stateUuid,
      cityUuid,
    );

    const srn =
      await this.generateSRN(
        companyId,
      );

    const project =
      await this.projectRepository.create({
        companyId,
        clientId: client.id,
        srn,

        ...projectData,

        startDate:
          projectData.startDate
            ? new Date(
                projectData.startDate,
              )
            : undefined,

        expectedEndDate:
          projectData.expectedEndDate
            ? new Date(
                projectData.expectedEndDate,
              )
            : undefined,

        ...(stateId !== undefined && {
          stateId,
        }),

        ...(cityId !== undefined && {
          cityId,
        }),
      });

    return {
      message:
        'Project created successfully.',
      project,
    };
  }

  async findAll(
    user: AuthUser,
    query: ProjectQueryDto,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    return this.projectRepository.findAll(
      companyId,
      query,
    );
  }

  async findOne(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const project =
      await this.projectRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found.',
      );
    }

    return {
      project,
    };
  }

  async findByUuid(
    user: AuthUser,
    uuid: string,
  ) {
    return this.findOne(
      user,
      uuid,
    );
  }

  async update(
    user: AuthUser,
    uuid: string,
    dto: UpdateProjectDto,
  ) {
    const companyFilterId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const project =
      await this.projectRepository.findByUuid(
        companyFilterId,
        uuid,
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found.',
      );
    }

    const {
      clientUuid,
      stateUuid,
      cityUuid,
      ...projectData
    } = dto;

    let clientId:
      | bigint
      | undefined;

    if (clientUuid) {
      /*
       * Even platform owner can only select
       * a client from the project's company.
       */
      const client =
        await this.clientRepository.findByUuid(
          project.companyId,
          clientUuid,
        );

      if (!client) {
        throw new NotFoundException(
          'Client not found for this project company.',
        );
      }

      clientId = client.id;
    }

    const {
      stateId,
      cityId,
    } = await this.resolveLocationIds(
      stateUuid,
      cityUuid,
    );

    const updatedProject =
      await this.projectRepository.update(
        companyFilterId,
        uuid,
        {
          ...projectData,

          startDate:
            projectData.startDate
              ? new Date(
                  projectData.startDate,
                )
              : undefined,

          expectedEndDate:
            projectData.expectedEndDate
              ? new Date(
                  projectData.expectedEndDate,
                )
              : undefined,

          ...(clientId !== undefined && {
            clientId,
          }),

          ...(stateId !== undefined && {
            stateId,
          }),

          ...(cityId !== undefined && {
            cityId,
          }),
        },
      );

    return {
      message:
        'Project updated successfully.',
      project: updatedProject,
    };
  }

  async remove(
    user: AuthUser,
    uuid: string,
  ) {
    const companyId =
      this.isPlatformOwner(user)
        ? null
        : this.getUserCompanyId(user);

    const project =
      await this.projectRepository.findByUuid(
        companyId,
        uuid,
      );

    if (!project) {
      throw new NotFoundException(
        'Project not found.',
      );
    }

    await this.projectRepository.delete(
      companyId,
      uuid,
    );

    return {
      message:
        'Project deleted successfully.',
    };
  }
}
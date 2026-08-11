import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CompanyBoundaryService,
} from 'src/modules/authorization/services/company-boundary.service';

import { CityRepository } from 'src/modules/master/city/repositories/city.repository';
import { StateRepository } from 'src/modules/master/state/repositories/state.repository';
import { ClientRepository } from 'src/modules/client/repositories/client.repository';


import {
  ProjectCategoryRepository,
} from 'src/modules/project-category/repositories/project-category.repository';

import {
  OrganizationUnitRepository,
} from 'src/modules/organization-unit/repositories/organization-unit.repository';


import {
  ProjectPolicy,
} from 'src/modules/authorization/policies/project.policy';

import {
  CreateProjectDto,
  ProjectQueryDto,
  UpdateProjectDto,
} from '../dto';

import {
  ProjectRepository,
} from '../repositories/project.repository';


interface AuthUser {
  id: bigint;
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


    private readonly projectCategoryRepository:
      ProjectCategoryRepository,

    private readonly organizationUnitRepository:
      OrganizationUnitRepository,

    
  private readonly companyBoundaryService:
    CompanyBoundaryService,

     private readonly projectPolicy:
    ProjectPolicy,
  ) {}







  private async resolveLocationIds(
    stateUuid?: string,
    cityUuid?: string,
  ) {

    let stateId:
      bigint | undefined;

    let cityId:
      bigint | undefined;



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


      stateId =
        state.id;
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
          'Selected city does not belong to selected state.',
        );
      }


      cityId =
        city.id;
    }



    return {
      stateId,
      cityId,
    };
  }




  private async generateSRN(
    companyId: bigint,
  ) {

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
  clientUuid,
  categoryUuid,
  organizationUnitUuid,
  stateUuid,
  cityUuid,
  ...projectData
} = dto;

/*
 * Company-side project API me
 * authenticated user's company hi
 * source of truth hai.
 *
 * DTO companyUuid authorization
 * decide nahi karega.
 */


const companyId =
  await this.companyBoundaryService
    .getCompanyId(
      user.id,
    );


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



    const category =
      await this.projectCategoryRepository.findByUuid(
        companyId,
        categoryUuid,
      );


    if (!category) {
      throw new NotFoundException(
        'Project category not found.',
      );
    }



    if (!organizationUnitUuid) {
      throw new BadRequestException(
        'Organization unit is required for project.',
      );
    }



    const organizationUnit =
      await this.organizationUnitRepository.findByUuid(
        companyId,
        organizationUnitUuid,
      );


    if (!organizationUnit) {
      throw new NotFoundException(
        'Organization unit not found.',
      );
    }



    const {
      stateId,
      cityId,
    } =
      await this.resolveLocationIds(
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

        clientId:
          client.id,

        categoryId:
          category.id,

        organizationUnitId:
          organizationUnit.id,

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


        ...(stateId && {
          stateId,
        }),


        ...(cityId && {
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
    await this.companyBoundaryService
      .getCompanyId(
        user.id,
      );

  const scopeWhere =
    await this.projectPolicy
      .buildWhere(
        user.id,
        'company.project.view',
      );

  return this.projectRepository.findAll(
    companyId,
    query,
    scopeWhere,
  );
}


async findOne(
  user: AuthUser,
  uuid: string,
) {
  const companyId =
    await this.companyBoundaryService
      .getCompanyId(
        user.id,
      );

  const scopeWhere =
    await this.projectPolicy
      .buildWhere(
        user.id,
        'company.project.view',
      );

  const project =
    await this.projectRepository.findByUuid(
      companyId,
      uuid,
      scopeWhere,
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
  const companyId =
    await this.companyBoundaryService
      .getCompanyId(
        user.id,
      );

  const scopeWhere =
    await this.projectPolicy
      .buildWhere(
        user.id,
        'company.project.update',
      );

  const project =
    await this.projectRepository
      .findByUuid(
        companyId,
        uuid,
        scopeWhere,
      );

  if (!project) {
    throw new NotFoundException(
      'Project not found.',
    );
  }

  const {
    clientUuid,
    categoryUuid,
    organizationUnitUuid,
    stateUuid,
    cityUuid,
    ...projectData
  } = dto;

  let clientId:
    bigint | undefined;

  if (clientUuid) {
    const client =
      await this.clientRepository
        .findByUuid(
          project.companyId,
          clientUuid,
        );

    if (!client) {
      throw new NotFoundException(
        'Client not found.',
      );
    }

    clientId =
      client.id;
  }

  let categoryId:
    bigint | undefined;

  if (categoryUuid) {
    const category =
      await this.projectCategoryRepository
        .findByUuid(
          project.companyId,
          categoryUuid,
        );

    if (!category) {
      throw new NotFoundException(
        'Project category not found.',
      );
    }

    categoryId =
      category.id;
  }

  let organizationUnitId:
    bigint | undefined;

  if (organizationUnitUuid) {
    const organizationUnit =
      await this.organizationUnitRepository
        .findByUuid(
          project.companyId,
          organizationUnitUuid,
        );

    if (!organizationUnit) {
      throw new NotFoundException(
        'Organization unit not found.',
      );
    }

    organizationUnitId =
      organizationUnit.id;
  }

  const {
    stateId,
    cityId,
  } =
    await this.resolveLocationIds(
      stateUuid,
      cityUuid,
    );

  const updatedProject =
    await this.projectRepository
      .update(
        companyId,
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

          ...(categoryId !== undefined && {
            categoryId,
          }),

          ...(organizationUnitId !==
            undefined && {
            organizationUnitId,
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

    project:
      updatedProject,
  };
}




async remove(
  user: AuthUser,
  uuid: string,
) {
  const companyId =
    await this.companyBoundaryService
      .getCompanyId(
        user.id,
      );

  const scopeWhere =
    await this.projectPolicy
      .buildWhere(
        user.id,
        'company.project.delete',
      );

  const project =
    await this.projectRepository
      .findByUuid(
        companyId,
        uuid,
        scopeWhere,
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
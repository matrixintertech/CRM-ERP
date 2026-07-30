import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CityRepository } from 'src/modules/master/city/repositories/city.repository';
import { StateRepository } from 'src/modules/master/state/repositories/state.repository';
import { ClientRepository } from 'src/modules/client/repositories/client.repository';

import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
} from '../dto';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly clientRepository: ClientRepository,
    private readonly stateRepository: StateRepository,
    private readonly cityRepository: CityRepository,
  ) {}

  private async generateSRN(
    companyId: bigint,
  ): Promise<string> {
    const year = new Date().getFullYear();

    const total =
      await this.projectRepository.count(companyId);

    return `SRN-${year}-${String(total + 1).padStart(4, '0')}`;
  }

  async create(
    companyId: bigint,
    dto: CreateProjectDto,
  ) {
    const {
      clientUuid,
      stateUuid,
      cityUuid,
      ...projectData
    } = dto;

    const client =
      await this.clientRepository.findByUuid(
        companyId,
        clientUuid,
      );

    if (!client) {
      throw new NotFoundException(
        'Client not found.',
      );
    }

    let stateId: bigint | undefined;

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

    let cityId: bigint | undefined;

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

      cityId = city.id;
    }

    const srn = await this.generateSRN(
      companyId,
    );

    return this.projectRepository.create({
      companyId,
      clientId: client.id,
      srn,

      ...projectData,

      startDate: projectData.startDate
        ? new Date(projectData.startDate)
        : undefined,

      expectedEndDate: projectData.expectedEndDate
        ? new Date(projectData.expectedEndDate)
        : undefined,

      ...(stateId && { stateId }),
      ...(cityId && { cityId }),
    });
  }

async findAll(
  companyId: bigint,
  query: ProjectQueryDto,
) {
  return this.projectRepository.findAll(
    companyId,
    query,
  );
}

  async findOne(
    companyId: bigint,
    uuid: string,
  ) {
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
  companyId: bigint,
  uuid: string,
) {
  const project = await this.projectRepository.findByUuid(
    companyId,
    uuid,
  );

  if (!project) {
    throw new NotFoundException('Project not found.');
  }

  return {
    project,
  };
}

  async update(
    companyId: bigint,
    uuid: string,
    dto: UpdateProjectDto,
  ) {
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

    const {
      clientUuid,
      stateUuid,
      cityUuid,
      ...projectData
    } = dto;

    let clientId: bigint | undefined;

    if (clientUuid) {
      const client =
        await this.clientRepository.findByUuid(
          companyId,
          clientUuid,
        );

      if (!client) {
        throw new NotFoundException(
          'Client not found.',
        );
      }

      clientId = client.id;
    }

    let stateId: bigint | undefined;

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

    let cityId: bigint | undefined;

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

      cityId = city.id;
    }

   return this.projectRepository.update(
  companyId,
  uuid,
  {
    ...projectData,

    startDate: projectData.startDate
      ? new Date(projectData.startDate)
      : undefined,

    expectedEndDate: projectData.expectedEndDate
      ? new Date(projectData.expectedEndDate)
      : undefined,

    ...(clientId && { clientId }),
    ...(stateId && { stateId }),
    ...(cityId && { cityId }),
  },
);
  }

  async remove(
    companyId: bigint,
    uuid: string,
  ) {
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
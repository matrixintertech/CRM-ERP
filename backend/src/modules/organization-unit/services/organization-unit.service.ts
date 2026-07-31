import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateOrganizationUnitDto } from '../dto/create-organization-unit.dto';
import { UpdateOrganizationUnitDto } from '../dto/update-organization-unit.dto';
import { OrganizationUnitRepository } from '../repositories/organization-unit.repository';

@Injectable()
export class OrganizationUnitService {
  constructor(
    private readonly organizationUnitRepository: OrganizationUnitRepository,
  ) {}

async create(
  companyId: number,
  dto: CreateOrganizationUnitDto,
) {
    // 1. Company Exists?
   const company =
     await this.organizationUnitRepository.findCompanyById(
    BigInt(companyId),
  );

    if (!company) {
      throw new NotFoundException(
        'Company not found.',
      );
    }

    // 2. Parent Exists? (Optional)
    if (dto.parentId) {
     const parent =
        await this.organizationUnitRepository.findParentById(
          BigInt(companyId),
          BigInt(dto.parentId),
        );

      if (!parent) {
        throw new NotFoundException(
          'Parent organization unit not found.',
        );
      }
    }

    // 3. Code Exists?
    const code =
  await this.organizationUnitRepository.findByCode(
    BigInt(companyId),
    dto.code,
  );

    if (code) {
      throw new ConflictException(
        'Organization unit code already exists.',
      );
    }

    // 4. Name Exists?
   const name =
  await this.organizationUnitRepository.findByName(
    BigInt(companyId),
    dto.name,
  );

    if (name) {
      throw new ConflictException(
        'Organization unit name already exists.',
      );
    }

    // 5. Create
    const organizationUnit =
      await this.organizationUnitRepository.create(
        {
          company: {
            connect: {
              id: BigInt(companyId),
            },
          },

          parent: dto.parentId
            ? {
                connect: {
                  id: BigInt(dto.parentId),
                },
              }
            : undefined,

          type: dto.type,

          name: dto.name,

          code: dto.code,

          email: dto.email,

          mobile: dto.mobile,

          addressLine1:
            dto.addressLine1,

          addressLine2:
            dto.addressLine2,

          city: dto.city,

          state: dto.state,

          country: dto.country,

          pincode: dto.pincode,
        },
      );

    return {
      message:
        'Organization unit created successfully.',

      organizationUnit,
    };
  }

async findAll(
  companyId: number,
) {
  // Company Exists?
  const company =
    await this.organizationUnitRepository.findCompanyById(
      BigInt(companyId),
    );

  if (!company) {
    throw new NotFoundException(
      'Company not found.',
    );
  }

  const organizationUnits =
    await this.organizationUnitRepository.findAllByCompanyId(
      BigInt(companyId),
    );

  return {
    message:
      'Organization units fetched successfully.',
    organizationUnits,
  };
}


async findOne(
  companyId: number,
  id: number,
) {
 const organizationUnit =
  await this.organizationUnitRepository.findById(
    BigInt(companyId),
    BigInt(id),
  );

  if (!organizationUnit) {
    throw new NotFoundException(
      'Organization unit not found.',
    );
  }

  return {
    message:
      'Organization unit fetched successfully.',
    organizationUnit,
  };
}


async update(
  companyId: number,
  id: number,
  dto: UpdateOrganizationUnitDto,
) {
  const organizationUnit =
    await this.organizationUnitRepository.findById(
      BigInt(companyId),
      BigInt(id),
    );

  if (!organizationUnit) {
    throw new NotFoundException(
      'Organization unit not found.',
    );
  }

  // Code duplicate check
  if (
    dto.code &&
    dto.code !== organizationUnit.code
  ) {
    const code =
      await this.organizationUnitRepository.findByCode(
        BigInt(companyId),
        dto.code,
      );

    if (code) {
      throw new ConflictException(
        'Organization unit code already exists.',
      );
    }
  }

  // Name duplicate check
  if (
    dto.name &&
    dto.name !== organizationUnit.name
  ) {
    const name =
      await this.organizationUnitRepository.findByName(
        BigInt(companyId),
        dto.name,
      );

    if (name) {
      throw new ConflictException(
        'Organization unit name already exists.',
      );
    }
  }

  return this.organizationUnitRepository.update(
    BigInt(id),
    dto,
  );
}


async delete(
  companyId: number,
  id: number,
) {
  // 1. Exists?
  const organizationUnit =
  await this.organizationUnitRepository.findById(
    BigInt(companyId),
    BigInt(id),
  );

  if (!organizationUnit) {
    throw new NotFoundException(
      'Organization unit not found.',
    );
  }

  // 2. Child Exists?
const child =
  await this.organizationUnitRepository.findChildren(
    BigInt(companyId),
    BigInt(id),
  );

  if (child) {
    throw new ConflictException(
      'Cannot delete organization unit because child units exist.',
    );
  }

  // 3. Soft Delete
  await this.organizationUnitRepository.delete(
    BigInt(id),
  );

  return {
    message:
      'Organization unit deleted successfully.',
  };
}



}
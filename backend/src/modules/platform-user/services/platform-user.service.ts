import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  UserStatus,
  UserType,
  type User,
} from '@prisma/client';

import {
  CreatePlatformUserDto,
  UpdatePlatformUserDto,
} from '../dto';

import {
  PlatformUserRepository,
} from '../repositories/platform-user.repository';

import {
  PlatformRoleRepository,
} from '../../platform-roles/repositories/platform-role.repository';


@Injectable()
export class PlatformUserService {
  constructor(
    private readonly platformUserRepository:
      PlatformUserRepository,

    private readonly platformRoleRepository:
      PlatformRoleRepository,
  ) {}


  async create(
    currentUser: User,
    dto: CreatePlatformUserDto,
  ) {
    const displayName =
      dto.displayName.trim();

    const email =
      dto.email.trim().toLowerCase();

    const mobile =
      dto.mobile?.trim();


    /*
     * Validate assigned Platform Role.
     *
     * Only ACTIVE + non-deleted
     * PlatformRole can be assigned.
     */
    const platformRole =
      await this.platformRoleRepository.findActiveByUuid(
        dto.platformRoleUuid,
      );

    if (!platformRole) {
      throw new NotFoundException(
        'Active platform role not found.',
      );
    }


    const existingEmail =
      await this.platformUserRepository.findByEmail(
        email,
      );

    if (existingEmail) {
      throw new ConflictException(
        'Email already exists.',
      );
    }


    if (mobile) {
      const existingMobile =
        await this.platformUserRepository.findByMobile(
          mobile,
        );

      if (existingMobile) {
        throw new ConflictException(
          'Mobile number already exists.',
        );
      }
    }


    const user =
      await this.platformUserRepository.create({
        displayName,

        email,

        mobile:
          mobile || null,

        /*
         * This endpoint always creates
         * a PLATFORM user.
         *
         * Never accept userType from client.
         */
        userType:
          UserType.PLATFORM_OWNER,

        status:
          UserStatus.ACTIVE,

        /*
         * Platform user must belong
         * to a PlatformRole.
         */
        platformRole: {
          connect: {
            id:
              platformRole.id,
          },
        },
      });


    return {
      message:
        'Platform user created successfully.',

      user,
    };
  }


  async findAll(
    currentUser: User,
  ) {
    const users =
      await this.platformUserRepository.findAll();

    return {
      message:
        'Platform users fetched successfully.',

      users,
    };
  }


  async findOne(
    currentUser: User,
    uuid: string,
  ) {
    const user =
      await this.platformUserRepository.findByUuid(
        uuid,
      );

    if (!user) {
      throw new NotFoundException(
        'Platform user not found.',
      );
    }

    return {
      message:
        'Platform user fetched successfully.',

      user,
    };
  }


  async update(
    currentUser: User,
    uuid: string,
    dto: UpdatePlatformUserDto,
  ) {
    const existingUser =
      await this.platformUserRepository.findByUuid(
        uuid,
      );

    if (!existingUser) {
      throw new NotFoundException(
        'Platform user not found.',
      );
    }


    /*
     * Self-deactivation protection.
     *
     * This is a business safety rule,
     * not an authorization bypass.
     */
    if (
      currentUser.uuid === uuid &&
      dto.status !== undefined &&
      dto.status !== UserStatus.ACTIVE
    ) {
      throw new ConflictException(
        'You cannot deactivate your own account.',
      );
    }


    const displayName =
      dto.displayName !== undefined
        ? dto.displayName.trim()
        : undefined;

    const email =
      dto.email !== undefined
        ? dto.email
            .trim()
            .toLowerCase()
        : undefined;

    const mobile =
      dto.mobile !== undefined
        ? dto.mobile.trim()
        : undefined;


    /*
     * Role is optional during update.
     *
     * If provided, validate before
     * changing existing assignment.
     */
    let platformRole:
      | Awaited<
          ReturnType<
            PlatformRoleRepository['findActiveByUuid']
          >
        >
      | undefined;

    if (
      dto.platformRoleUuid !==
      undefined
    ) {
      platformRole =
        await this.platformRoleRepository.findActiveByUuid(
          dto.platformRoleUuid,
        );

      if (!platformRole) {
        throw new NotFoundException(
          'Active platform role not found.',
        );
      }
    }


    if (
      email &&
      email !==
        existingUser.email
    ) {
      const duplicateEmail =
        await this.platformUserRepository.findByEmail(
          email,
        );

      if (duplicateEmail) {
        throw new ConflictException(
          'Email already exists.',
        );
      }
    }


    if (
      mobile &&
      mobile !==
        existingUser.mobile
    ) {
      const duplicateMobile =
        await this.platformUserRepository.findByMobile(
          mobile,
        );

      if (duplicateMobile) {
        throw new ConflictException(
          'Mobile number already exists.',
        );
      }
    }


    const user =
      await this.platformUserRepository.update(
        uuid,
        {
          ...(displayName !==
            undefined && {
            displayName,
          }),

          ...(email !==
            undefined && {
            email,
          }),

          ...(mobile !==
            undefined && {
            mobile:
              mobile || null,
          }),

          ...(dto.status !==
            undefined && {
            status:
              dto.status,
          }),

          /*
           * Change PlatformRole only
           * when platformRoleUuid was
           * supplied.
           */
          ...(platformRole && {
            platformRole: {
              connect: {
                id:
                  platformRole.id,
              },
            },
          }),
        },
      );


    return {
      message:
        'Platform user updated successfully.',

      user,
    };
  }


  async delete(
    currentUser: User,
    uuid: string,
  ) {
    /*
     * Self-delete protection.
     */
    if (
      currentUser.uuid === uuid
    ) {
      throw new ConflictException(
        'You cannot delete your own account.',
      );
    }


    const user =
      await this.platformUserRepository.findByUuid(
        uuid,
      );

    if (!user) {
      throw new NotFoundException(
        'Platform user not found.',
      );
    }


    const deletedUser =
      await this.platformUserRepository.softDelete(
        uuid,
      );


    return {
      message:
        'Platform user deleted successfully.',

      user:
        deletedUser,
    };
  }
}
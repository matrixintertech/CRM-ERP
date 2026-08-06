import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserStatus, UserType, type User } from '@prisma/client';

import { CreatePlatformUserDto, UpdatePlatformUserDto } from '../dto';

import { PlatformUserRepository } from '../repositories/platform-user.repository';

@Injectable()
export class PlatformUserService {
  constructor(
    private readonly platformUserRepository: PlatformUserRepository,
  ) {}

  private ensurePlatformOwner(currentUser: User) {
    if (currentUser.userType !== UserType.PLATFORM_OWNER) {
      throw new ForbiddenException(
        'Only platform owners can manage platform users.',
      );
    }
  }

  async create(currentUser: User, dto: CreatePlatformUserDto) {
    this.ensurePlatformOwner(currentUser);

    const displayName = dto.displayName.trim();

    const email = dto.email.trim().toLowerCase();

    const mobile = dto.mobile?.trim();

    const existingEmail = await this.platformUserRepository.findByEmail(email);

    if (existingEmail) {
      throw new ConflictException('Email already exists.');
    }

    if (mobile) {
      const existingMobile =
        await this.platformUserRepository.findByMobile(mobile);

      if (existingMobile) {
        throw new ConflictException('Mobile number already exists.');
      }
    }

    const user = await this.platformUserRepository.create({
      displayName,
      email,

      mobile: mobile || null,

      userType: UserType.PLATFORM_OWNER,

      status: UserStatus.ACTIVE,
    });

    return {
      message: 'Platform user created successfully.',

      user,
    };
  }

  async findAll(currentUser: User) {
    this.ensurePlatformOwner(currentUser);

    const users = await this.platformUserRepository.findAll();

    return {
      message: 'Platform users fetched successfully.',

      users,
    };
  }

  async findOne(currentUser: User, uuid: string) {
    this.ensurePlatformOwner(currentUser);

    const user = await this.platformUserRepository.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('Platform user not found.');
    }

    return {
      message: 'Platform user fetched successfully.',

      user,
    };
  }

  async update(currentUser: User, uuid: string, dto: UpdatePlatformUserDto) {
    this.ensurePlatformOwner(currentUser);

    const existingUser = await this.platformUserRepository.findByUuid(uuid);

    if (!existingUser) {
      throw new NotFoundException('Platform user not found.');
    }

    if (
      currentUser.uuid === uuid &&
      dto.status !== undefined &&
      dto.status !== UserStatus.ACTIVE
    ) {
      throw new ConflictException('You cannot deactivate your own account.');
    }

    const displayName =
      dto.displayName !== undefined ? dto.displayName.trim() : undefined;

    const email =
      dto.email !== undefined ? dto.email.trim().toLowerCase() : undefined;

    const mobile = dto.mobile !== undefined ? dto.mobile.trim() : undefined;

    if (email && email !== existingUser.email) {
      const duplicateEmail =
        await this.platformUserRepository.findByEmail(email);

      if (duplicateEmail) {
        throw new ConflictException('Email already exists.');
      }
    }

    if (mobile && mobile !== existingUser.mobile) {
      const duplicateMobile =
        await this.platformUserRepository.findByMobile(mobile);

      if (duplicateMobile) {
        throw new ConflictException('Mobile number already exists.');
      }
    }

    const user = await this.platformUserRepository.update(uuid, {
      ...(displayName !== undefined && {
        displayName,
      }),

      ...(email !== undefined && {
        email,
      }),

      ...(mobile !== undefined && {
        mobile: mobile || null,
      }),

      ...(dto.status !== undefined && {
        status: dto.status,
      }),
    });

    return {
      message: 'Platform user updated successfully.',

      user,
    };
  }

  async delete(currentUser: User, uuid: string) {
    this.ensurePlatformOwner(currentUser);

    if (currentUser.uuid === uuid) {
      throw new ConflictException('You cannot delete your own account.');
    }

    const user = await this.platformUserRepository.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('Platform user not found.');
    }

    const deletedUser = await this.platformUserRepository.softDelete(uuid);

    return {
      message: 'Platform user deleted successfully.',

      user: deletedUser,
    };
  }
}

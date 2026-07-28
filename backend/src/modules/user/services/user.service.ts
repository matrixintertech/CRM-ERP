import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { UserRepository } from '../repositories/user.repository';

import { CreateUserDto } from '../dto/create-user.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  
async create(
  dto: CreateUserDto,
  tx?: Prisma.TransactionClient,
) {
  // 1. Email Exists?
  if (dto.email) {
    const email =
      await this.userRepository.findByEmail(
        dto.email,
      );

    if (email) {
      throw new ConflictException(
        'Email already exists.',
      );
    }
  }

  // 2. Mobile Exists?
  if (dto.mobile) {
    const mobile =
      await this.userRepository.findByMobile(
        dto.mobile,
      );

    if (mobile) {
      throw new ConflictException(
        'Mobile already exists.',
      );
    }
  }

  // 3. Create User
  const user =
    await this.userRepository.create(
      {
        displayName: dto.displayName,
        email: dto.email,
        mobile: dto.mobile,
        userType: dto.userType,
        status: dto.status,

        company: dto.companyId
          ? {
              connect: {
                id: BigInt(dto.companyId),
              },
            }
          : undefined,
      },
      tx,
    );

  return user;
}

async findCompanyAdmin(
  companyId: bigint,
) {
  return this.userRepository.findCompanyAdmin(
    companyId,
  );
}





}
import {
  Prisma,
} from '@prisma/client';

export type ProjectWithRelations =
  Prisma.ProjectGetPayload<{
    include: {
      client: {
        select: {
          id: true;
          uuid: true;
          name: true;
          code: true;
          contactName: true;
          mobile: true;
        };
      };

      category: {
        select: {
          id: true;
          uuid: true;
          name: true;
          code: true;
        };
      };

      organizationUnit: {
        select: {
          id: true;
          uuid: true;
          name: true;
          code: true;
          type: true;
        };
      };

      state: {
        select: {
          id: true;
          uuid: true;
          name: true;
        };
      };

      city: {
        select: {
          id: true;
          uuid: true;
          name: true;
        };
      };
    };
  }>;
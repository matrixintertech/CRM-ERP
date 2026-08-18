import {
  Module,
} from "@nestjs/common";

import {
  S3StorageService,
} from "./services/s3-storage.service";

import {
  STORAGE_PROVIDER,
} from "./storage.constants";

import {
  StorageService,
} from "./storage.service";


@Module({
  providers: [
    S3StorageService,

    {
      provide:
        STORAGE_PROVIDER,

      useExisting:
        S3StorageService,
    },

    StorageService,
  ],

  exports: [
    StorageService,
  ],
})
export class StorageModule {}
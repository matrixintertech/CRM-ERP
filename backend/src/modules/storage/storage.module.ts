import {
  Module,
} from "@nestjs/common";

import {
  S3StorageService,
} from "./services/s3-storage.service";


export const STORAGE_PROVIDER =
  Symbol(
    "STORAGE_PROVIDER",
  );


@Module({
  providers: [
    /*
     * Concrete S3-compatible implementation.
     *
     * Supports:
     * - Cloudflare R2
     * - AWS S3
     * - MinIO
     * - other S3-compatible providers
     */
    S3StorageService,


    /*
     * Business modules should depend
     * on STORAGE_PROVIDER instead of
     * S3StorageService directly.
     */
    {
      provide:
        STORAGE_PROVIDER,

      useExisting:
        S3StorageService,
    },
  ],


  exports: [
    STORAGE_PROVIDER,
  ],
})
export class StorageModule {}
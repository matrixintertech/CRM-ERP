import {
  Inject,
  Injectable,
} from "@nestjs/common";

import {
  randomUUID,
} from "crypto";

import {
  STORAGE_PROVIDER,
} from "./storage.constants";

import type {
  CreateDownloadUrlInput,
  CreateUploadUrlInput,
  DeleteObjectInput,
  HeadObjectInput,
  PresignedDownload,
  PresignedUpload,
  PutObjectInput,
  StorageProvider,
  StoredObjectMetadata,
  StoredObjectReference,
} from "./types/storage.types";


@Injectable()
export class StorageService {
  constructor(
    @Inject(
      STORAGE_PROVIDER,
    )
    private readonly storageProvider:
      StorageProvider,
  ) {}


  /*
   * =========================================================
   * GENERATE SAFE OBJECT KEY
   * =========================================================
   *
   * Original filename ko object key nahi banayenge.
   *
   * Example:
   *
   * companies/4/projects/abc/tasks/xyz/reports/uuid.jpg
   */
  generateObjectKey(
    folder: string,
    originalFileName: string,
  ): string {
    const normalizedFolder =
      folder
        .trim()
        .replace(
          /\\/g,
          "/",
        )
        .replace(
          /^\/+|\/+$/g,
          "",
        );


    if (!normalizedFolder) {
      throw new Error(
        "Storage folder is required.",
      );
    }


    const extension =
      this.getFileExtension(
        originalFileName,
      );


    const fileName =
      extension
        ? `${randomUUID()}.${extension}`
        : randomUUID();


    return `${normalizedFolder}/${fileName}`;
  }


  /*
   * =========================================================
   * SERVER-SIDE UPLOAD
   * =========================================================
   */
  putObject(
    input:
      PutObjectInput,
  ): Promise<StoredObjectReference> {
    return this.storageProvider
      .putObject(
        input,
      );
  }


  /*
   * =========================================================
   * PRESIGNED UPLOAD
   * =========================================================
   */
  createUploadUrl(
    input:
      CreateUploadUrlInput,
  ): Promise<PresignedUpload> {
    return this.storageProvider
      .createUploadUrl(
        input,
      );
  }


  /*
   * =========================================================
   * PRESIGNED PRIVATE DOWNLOAD
   * =========================================================
   */
  createDownloadUrl(
    input:
      CreateDownloadUrlInput,
  ): Promise<PresignedDownload> {
    return this.storageProvider
      .createDownloadUrl(
        input,
      );
  }


  /*
   * =========================================================
   * HEAD / VERIFY OBJECT
   * =========================================================
   *
   * Presigned upload ke baad actual object
   * storage me exist karta hai ya nahi,
   * actual MIME type aur actual size verify
   * karne ke liye.
   *
   * null:
   * object storage me nahi mila.
   */
  headObject(
    input:
      HeadObjectInput,
  ): Promise<
    StoredObjectMetadata | null
  > {
    return this.storageProvider
      .headObject(
        input,
      );
  }


  /*
   * =========================================================
   * DELETE
   * =========================================================
   */
  deleteObject(
    input:
      DeleteObjectInput,
  ): Promise<void> {
    return this.storageProvider
      .deleteObject(
        input,
      );
  }


  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */
  private getFileExtension(
    fileName: string,
  ): string | null {
    const normalized =
      fileName
        .trim()
        .toLowerCase();


    const lastDot =
      normalized.lastIndexOf(
        ".",
      );


    if (
      lastDot <=
        0 ||
      lastDot ===
        normalized.length -
          1
    ) {
      return null;
    }


    const extension =
      normalized.slice(
        lastDot + 1,
      );


    /*
     * Extension ko simple safe
     * alphanumeric format tak limit.
     */
    if (
      !/^[a-z0-9]+$/.test(
        extension,
      )
    ) {
      return null;
    }


    return extension;
  }
}
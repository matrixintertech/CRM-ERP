import {
  Injectable,
} from "@nestjs/common";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";

import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

import type {
  CreateDownloadUrlInput,
  CreateUploadUrlInput,
  DeleteObjectInput,
  PresignedDownload,
  PresignedUpload,
  PutObjectInput,
  StorageProvider,
  StoredObjectReference,
} from "../types/storage.types";


@Injectable()
export class S3StorageService
  implements StorageProvider {

  private readonly client:
    S3Client;

  private readonly bucket:
    string;

  private readonly defaultUploadExpiresIn:
    number;

  private readonly defaultDownloadExpiresIn:
    number;


  constructor() {
    /*
     * =======================================================
     * REQUIRED CONFIG
     * =======================================================
     */
    this.bucket =
      this.requireEnvironment(
        "STORAGE_BUCKET",
      );


    const region =
      process.env.STORAGE_REGION
        ?.trim() ||
      "auto";


    const endpoint =
      process.env.STORAGE_ENDPOINT
        ?.trim();


    const accessKeyId =
      process.env.STORAGE_ACCESS_KEY_ID
        ?.trim();


    const secretAccessKey =
      process.env.STORAGE_SECRET_ACCESS_KEY
        ?.trim();


    /*
     * =======================================================
     * EXPIRATION
     * =======================================================
     */
    this.defaultUploadExpiresIn =
      this.parseExpiration(
        process.env
          .STORAGE_UPLOAD_URL_EXPIRES_IN,
        900,
      );


    this.defaultDownloadExpiresIn =
      this.parseExpiration(
        process.env
          .STORAGE_DOWNLOAD_URL_EXPIRES_IN,
        900,
      );


    /*
     * =======================================================
     * S3 CLIENT
     * =======================================================
     *
     * Cloudflare R2:
     *
     * region   = auto
     * endpoint = https://ACCOUNT_ID.r2.cloudflarestorage.com
     *
     * AWS S3:
     *
     * region   = ap-south-1 etc.
     * endpoint can remain empty.
     */
    const config:
      S3ClientConfig = {
      region,
    };


    if (endpoint) {
      config.endpoint =
        endpoint;
    }


    /*
     * Explicit credentials:
     *
     * Required for R2 API token credentials.
     *
     * AWS environment/IAM based deployments
     * can omit them and AWS SDK credential
     * resolution can take over.
     */
    if (
      accessKeyId &&
      secretAccessKey
    ) {
      config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    } else if (
      accessKeyId ||
      secretAccessKey
    ) {
      throw new Error(
        "Both STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY must be provided together.",
      );
    }


    this.client =
      new S3Client(
        config,
      );
  }


  /*
   * =========================================================
   * DIRECT SERVER UPLOAD
   * =========================================================
   */
  async putObject(
    input:
      PutObjectInput,
  ): Promise<StoredObjectReference> {
    const key =
      this.normalizeKey(
        input.key,
      );


    const result =
      await this.client.send(
        new PutObjectCommand({
          Bucket:
            this.bucket,

          Key:
            key,

          Body:
            input.body,

          ...(input.contentType && {
            ContentType:
              input.contentType,
          }),

          ...(input.contentLength !==
            undefined && {
            ContentLength:
              input.contentLength,
          }),

          ...(input.metadata && {
            Metadata:
              input.metadata,
          }),
        }),
      );


    return {
      key,

      bucket:
        this.bucket,

      contentType:
        input.contentType,

      size:
        input.contentLength,

      etag:
        result.ETag
          ? this.normalizeEtag(
              result.ETag,
            )
          : undefined,
    };
  }


  /*
   * =========================================================
   * PRESIGNED DIRECT UPLOAD
   * =========================================================
   *
   * Browser/mobile:
   *
   * PUT presignedUrl
   * Content-Type must match.
   */
  async createUploadUrl(
    input:
      CreateUploadUrlInput,
  ): Promise<PresignedUpload> {
    const key =
      this.normalizeKey(
        input.key,
      );


    const contentType =
      input.contentType
        .trim()
        .toLowerCase();


    if (!contentType) {
      throw new Error(
        "Content type is required for presigned upload.",
      );
    }


    const expiresInSeconds =
      this.resolveExpiration(
        input.expiresInSeconds,
        this.defaultUploadExpiresIn,
      );


    const command =
      new PutObjectCommand({
        Bucket:
          this.bucket,

        Key:
          key,

        ContentType:
          contentType,
      });


    const url =
      await getSignedUrl(
        this.client,
        command,
        {
          expiresIn:
            expiresInSeconds,
        },
      );


    return {
      key,

      url,

      method:
        "PUT",

      expiresInSeconds,

      headers: {
        "Content-Type":
          contentType,
      },
    };
  }


  /*
   * =========================================================
   * PRESIGNED PRIVATE DOWNLOAD
   * =========================================================
   */
  async createDownloadUrl(
    input:
      CreateDownloadUrlInput,
  ): Promise<PresignedDownload> {
    const key =
      this.normalizeKey(
        input.key,
      );


    const expiresInSeconds =
      this.resolveExpiration(
        input.expiresInSeconds,
        this.defaultDownloadExpiresIn,
      );


    const downloadFileName =
      input.downloadFileName
        ? this.sanitizeDownloadFileName(
            input.downloadFileName,
          )
        : undefined;


    const command =
      new GetObjectCommand({
        Bucket:
          this.bucket,

        Key:
          key,

        ...(downloadFileName && {
          ResponseContentDisposition:
            `attachment; filename="${downloadFileName}"`,
        }),
      });


    const url =
      await getSignedUrl(
        this.client,
        command,
        {
          expiresIn:
            expiresInSeconds,
        },
      );


    return {
      key,

      url,

      expiresInSeconds,
    };
  }


  /*
   * =========================================================
   * DELETE OBJECT
   * =========================================================
   */
  async deleteObject(
    input:
      DeleteObjectInput,
  ): Promise<void> {
    const key =
      this.normalizeKey(
        input.key,
      );


    await this.client.send(
      new DeleteObjectCommand({
        Bucket:
          this.bucket,

        Key:
          key,
      }),
    );
  }


  /*
   * =========================================================
   * PRIVATE HELPERS
   * =========================================================
   */

  private requireEnvironment(
    name:
      string,
  ): string {
    const value =
      process.env[name]
        ?.trim();


    if (!value) {
      throw new Error(
        `${name} environment variable is required.`,
      );
    }


    return value;
  }


  private normalizeKey(
    value:
      string,
  ): string {
    const normalized =
      value
        .trim()
        .replace(
          /\\/g,
          "/",
        )
        .replace(
          /^\/+/,
          "",
        )
        .replace(
          /\/{2,}/g,
          "/",
        );


    if (!normalized) {
      throw new Error(
        "Storage key is required.",
      );
    }


    const segments =
      normalized.split(
        "/",
      );


    if (
      segments.some(
        (segment) =>
          !segment ||
          segment === "." ||
          segment === "..",
      )
    ) {
      throw new Error(
        "Invalid storage key.",
      );
    }


    return normalized;
  }


  private parseExpiration(
    value:
      string | undefined,

    fallback:
      number,
  ): number {
    if (!value) {
      return fallback;
    }


    const parsed =
      Number(
        value,
      );


    if (
      !Number.isInteger(
        parsed,
      ) ||
      parsed <=
        0
    ) {
      throw new Error(
        "Storage URL expiration must be a positive integer.",
      );
    }


    return this.clampExpiration(
      parsed,
    );
  }


  private resolveExpiration(
    requested:
      number | undefined,

    fallback:
      number,
  ): number {
    if (
      requested ===
      undefined
    ) {
      return fallback;
    }


    if (
      !Number.isInteger(
        requested,
      ) ||
      requested <=
        0
    ) {
      throw new Error(
        "Storage URL expiration must be a positive integer.",
      );
    }


    return this.clampExpiration(
      requested,
    );
  }


  private clampExpiration(
    value:
      number,
  ): number {
    /*
     * R2 presigned URLs allow
     * 1 second → 7 days.
     */
    return Math.min(
      Math.max(
        value,
        1,
      ),
      604800,
    );
  }


  private normalizeEtag(
    etag:
      string,
  ): string {
    return etag.replace(
      /^"|"$/g,
      "",
    );
  }


  private sanitizeDownloadFileName(
    value:
      string,
  ): string {
    const sanitized =
      value
        .trim()
        .replace(
          /["\r\n]/g,
          "",
        );


    return (
      sanitized ||
      "download"
    );
  }
}
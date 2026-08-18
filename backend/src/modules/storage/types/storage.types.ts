export type StorageDriver =
  | "s3";


/*
 * =========================================================
 * STORED OBJECT
 * =========================================================
 *
 * Database me provider-specific public URL store
 * karne ke bajay storageKey store karenge.
 */
export interface StoredObjectReference {
  key: string;

  bucket: string;

  contentType?: string;

  size?: number;

  etag?: string;
}


/*
 * =========================================================
 * SERVER-SIDE UPLOAD
 * =========================================================
 *
 * Company logo / generated documents jaise cases
 * me backend directly upload kar sake.
 */
export interface PutObjectInput {
  key: string;

  body:
    | Buffer
    | Uint8Array
    | string;

  contentType?: string;

  contentLength?: number;

  metadata?: Record<
    string,
    string
  >;
}


/*
 * =========================================================
 * PRESIGNED UPLOAD
 * =========================================================
 *
 * Browser/mobile direct R2/S3 upload.
 *
 * Backend:
 * - authorization check karega
 * - safe key generate karega
 * - content type validate karega
 * - presigned PUT URL return karega
 */
export interface CreateUploadUrlInput {
  key: string;

  contentType: string;

  expiresInSeconds?: number;
}


export interface PresignedUpload {
  key: string;

  url: string;

  method: "PUT";

  expiresInSeconds: number;

  headers: {
    "Content-Type": string;
  };
}


/*
 * =========================================================
 * PRESIGNED DOWNLOAD
 * =========================================================
 *
 * Private bucket object ko temporary read
 * access dene ke liye.
 */
export interface CreateDownloadUrlInput {
  key: string;

  expiresInSeconds?: number;

  downloadFileName?: string;
}


export interface PresignedDownload {
  key: string;

  url: string;

  expiresInSeconds: number;
}


/*
 * =========================================================
 * DELETE
 * =========================================================
 */
export interface DeleteObjectInput {
  key: string;
}


/*
 * =========================================================
 * STORAGE PROVIDER CONTRACT
 * =========================================================
 *
 * Business modules ko R2 / AWS S3 ka knowledge
 * nahi hoga.
 *
 * They will depend only on this contract.
 */
export interface StorageProvider {
  putObject(
    input: PutObjectInput,
  ): Promise<StoredObjectReference>;


  createUploadUrl(
    input: CreateUploadUrlInput,
  ): Promise<PresignedUpload>;


  createDownloadUrl(
    input: CreateDownloadUrlInput,
  ): Promise<PresignedDownload>;


  deleteObject(
    input: DeleteObjectInput,
  ): Promise<void>;
}
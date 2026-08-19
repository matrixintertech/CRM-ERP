import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  PrismaService,
} from "src/database/prisma.service";

import {
  StorageService,
} from "../../storage/storage.service";

import {
  CreateProjectTaskReportUploadDto,
} from "../dto/create-project-task-report-upload.dto";


const MAX_TASK_REPORT_IMAGE_SIZE =
  5 * 1024 * 1024;


const TASK_REPORT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;


type TaskReportImageContentType =
  typeof TASK_REPORT_IMAGE_TYPES[number];


const IMAGE_EXTENSION_BY_MIME:
  Record<
    TaskReportImageContentType,
    string
  > = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};


export interface VerifyProjectTaskReportImageInput {
  storageKey: string;

  contentType: string;

  fileSize: number;
}


export interface VerifiedProjectTaskReportImage {
  storageKey: string;

  contentType:
    TaskReportImageContentType;

  sizeBytes: number;

  etag?: string;
}


@Injectable()
export class ProjectTaskReportAttachmentService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly storageService:
      StorageService,
  ) {}


  /*
   * =========================================================
   * CREATE PRESIGNED IMAGE UPLOAD
   * =========================================================
   *
   * Employee:
   *
   * 1. selects / captures image
   * 2. backend validates task ownership
   * 3. backend creates safe storage key
   * 4. backend returns presigned PUT URL
   *
   * Important:
   *
   * Attachment DB row yahan create nahi hoti.
   * Report submit ke time verified object ko
   * ProjectTaskReportAttachment me save karenge.
   */
  async createImageUpload(
    companyId: bigint,
    taskUuid: string,
    employeeId: bigint | null | undefined,
    dto: CreateProjectTaskReportUploadDto,
  ) {
    const task =
      await this.getExecutableTask(
        companyId,
        taskUuid,
        employeeId,
      );


    const contentType =
      this.validateImageContentType(
        dto.contentType,
      );


    this.validateImageSize(
      dto.fileSize,
    );


    /*
     * Original filename ki extension ko
     * storage object extension ke liye
     * trust nahi karenge.
     *
     * MIME type se canonical extension
     * generate karenge.
     */
    const extension =
      IMAGE_EXTENSION_BY_MIME[
        contentType
      ];


    const storageFileName =
      `image.${extension}`;


    const folder =
      this.getTaskReportUploadFolder(
        companyId,
        task.project.uuid,
        task.uuid,
      );


    const storageKey =
      this.storageService
        .generateObjectKey(
          folder,
          storageFileName,
        );


    const upload =
      await this.storageService
        .createUploadUrl({
          key:
            storageKey,

          contentType,
        });


    return {
      ...upload,

      originalName:
        dto.fileName,

      contentType,

      fileSize:
        dto.fileSize,
    };
  }


  /*
   * =========================================================
   * VERIFY UPLOADED IMAGE
   * =========================================================
   *
   * Report create karne se pehle call karenge.
   *
   * Verify:
   *
   * - key isi tenant/task ka hai
   * - object actually R2/S3 me exist karta hai
   * - MIME type same hai
   * - actual object <= 5 MB hai
   * - actual size client declared size se match hai
   * - same storage object already kisi report me use nahi hua
   */
  async verifyImageUpload(
    companyId: bigint,
    taskUuid: string,
    employeeId: bigint | null | undefined,
    input: VerifyProjectTaskReportImageInput,
  ): Promise<VerifiedProjectTaskReportImage> {
    const task =
      await this.getExecutableTask(
        companyId,
        taskUuid,
        employeeId,
      );


    const expectedContentType =
      this.validateImageContentType(
        input.contentType,
      );


    this.validateImageSize(
      input.fileSize,
    );


    const storageKey =
      this.validateStorageKey(
        input.storageKey,
      );


    const expectedFolder =
      this.getTaskReportUploadFolder(
        companyId,
        task.project.uuid,
        task.uuid,
      );


    const expectedPrefix =
      `${expectedFolder}/`;


    /*
     * User kisi doosri company/project/task
     * ka storageKey submit nahi kar sakta.
     */
    if (
      !storageKey.startsWith(
        expectedPrefix,
      )
    ) {
      throw new ForbiddenException(
        "Storage object does not belong to this task.",
      );
    }


    /*
     * Same uploaded object ko multiple
     * reports me attach hone se prevent.
     */
    const existingAttachment =
      await this.prisma
        .projectTaskReportAttachment
        .findFirst({
          where: {
            storageKey,

            report: {
              companyId,
            },
          },

          select: {
            id: true,
          },
        });


    if (existingAttachment) {
      throw new BadRequestException(
        "This uploaded file has already been attached to a report.",
      );
    }


    const object =
      await this.storageService
        .headObject({
          key:
            storageKey,
        });


    if (!object) {
      throw new BadRequestException(
        "Uploaded file was not found in storage.",
      );
    }


    if (
      object.size ===
      undefined
    ) {
      throw new BadRequestException(
        "Unable to determine uploaded file size.",
      );
    }


    this.validateImageSize(
      object.size,
    );


    const actualContentType =
      object.contentType
        ?.trim()
        .toLowerCase();


    if (!actualContentType) {
      throw new BadRequestException(
        "Uploaded file content type is missing.",
      );
    }


    const verifiedContentType =
      this.validateImageContentType(
        actualContentType,
      );


    /*
     * Presigned URL signed MIME type aur
     * report payload MIME type dono actual
     * uploaded object se match hone chahiye.
     */
    if (
      verifiedContentType !==
      expectedContentType
    ) {
      throw new BadRequestException(
        "Uploaded file content type does not match the requested content type.",
      );
    }


    /*
     * Browser supplied size ko blindly
     * trust nahi karte.
     *
     * Actual ContentLength exact match
     * hona chahiye.
     */
    if (
      object.size !==
      input.fileSize
    ) {
      throw new BadRequestException(
        "Uploaded file size does not match the requested file size.",
      );
    }


    return {
      storageKey,

      contentType:
        verifiedContentType,

      sizeBytes:
        object.size,

      etag:
        object.etag,
    };
  }


  /*
   * =========================================================
   * CREATE PRIVATE ATTACHMENT VIEW URL
   * =========================================================
   *
   * Private R2/S3 bucket ko directly public
   * nahi karenge.
   *
   * Flow:
   *
   * 1. Current employee owns the task
   * 2. Attachment belongs to same task
   * 3. Attachment belongs to same company
   * 4. Backend creates temporary signed GET URL
   *
   * URL intentionally short-lived:
   * 5 minutes.
   *
   * downloadFileName pass nahi karte,
   * isliye browser supported image ko inline
   * preview kar sakta hai.
   */
  async getAttachmentViewUrl(
    companyId: bigint,
    taskUuid: string,
    employeeId: bigint | null | undefined,
    attachmentUuid: string,
  ) {
    const task =
      await this.getExecutableTask(
        companyId,
        taskUuid,
        employeeId,
      );


    const attachment =
      await this.prisma
        .projectTaskReportAttachment
        .findFirst({
          where: {
            uuid:
              attachmentUuid,

            report: {
              companyId,

              taskId:
                task.id,
            },
          },

          select: {
            uuid:
              true,

            type:
              true,

            originalName:
              true,

            mimeType:
              true,

            sizeBytes:
              true,

            storageKey:
              true,

            createdAt:
              true,
          },
        });


    if (!attachment) {
      throw new NotFoundException(
        "Task report attachment not found.",
      );
    }


    const storageKey =
      this.validateStorageKey(
        attachment.storageKey,
      );


    /*
     * DB record tenant/task relation ke
     * through verify ho chuka hai.
     *
     * Signed URL only verified DB key ke
     * against generate hogi.
     */
    const signedUrl =
      await this.storageService
        .createDownloadUrl({
          key:
            storageKey,

          expiresInSeconds:
            300,
        });


    return {
      attachment: {
        uuid:
          attachment.uuid,

        type:
          attachment.type,

        originalName:
          attachment.originalName,

        mimeType:
          attachment.mimeType,

        /*
         * Task report images max 5 MB hain,
         * so Number conversion safe hai.
         */
        fileSize:
          Number(
            attachment.sizeBytes,
          ),

        createdAt:
          attachment.createdAt,
      },

      url:
        signedUrl.url,

      expiresInSeconds:
        signedUrl.expiresInSeconds,
    };
  }


  /*
   * =========================================================
   * TASK OWNERSHIP / EXECUTION BOUNDARY
   * =========================================================
   *
   * PermissionGuard:
   *
   * company.task.execute
   *
   * Service additionally OWN scope enforce
   * karegi:
   *
   * authenticated employee must be the
   * currently assigned active project member.
   */
  private async getExecutableTask(
    companyId: bigint,
    taskUuid: string,
    employeeId: bigint | null | undefined,
  ) {
    if (!employeeId) {
      throw new ForbiddenException(
        "An employee profile is required for task evidence access.",
      );
    }


    const task =
      await this.prisma
        .projectTask
        .findFirst({
          where: {
            companyId,

            uuid:
              taskUuid,

            deletedAt:
              null,
          },

          select: {
            id:
              true,

            uuid:
              true,

            project: {
              select: {
                uuid:
                  true,
              },
            },

            assignedProjectMember: {
              select: {
                employeeId:
                  true,

                isActive:
                  true,

                removedAt:
                  true,
              },
            },
          },
        });


    if (!task) {
      throw new NotFoundException(
        "Task not found.",
      );
    }


    const assignedProjectMember =
      task.assignedProjectMember;


    if (
      !assignedProjectMember ||
      !assignedProjectMember.isActive ||
      assignedProjectMember.removedAt !==
        null ||
      assignedProjectMember.employeeId !==
        employeeId
    ) {
      throw new ForbiddenException(
        "You are not assigned to this task.",
      );
    }


    return task;
  }


  /*
   * =========================================================
   * STORAGE FOLDER
   * =========================================================
   *
   * Example:
   *
   * companies/5/projects/<projectUuid>/
   * tasks/<taskUuid>/report-uploads/<uuid>.jpg
   */
  private getTaskReportUploadFolder(
    companyId: bigint,
    projectUuid: string,
    taskUuid: string,
  ): string {
    return [
      "companies",
      companyId.toString(),
      "projects",
      projectUuid,
      "tasks",
      taskUuid,
      "report-uploads",
    ].join(
      "/",
    );
  }


  /*
   * =========================================================
   * CONTENT TYPE VALIDATION
   * =========================================================
   */
  private validateImageContentType(
    value: string,
  ): TaskReportImageContentType {
    const normalized =
      value
        .trim()
        .toLowerCase();


    if (
      !TASK_REPORT_IMAGE_TYPES.includes(
        normalized as
          TaskReportImageContentType,
      )
    ) {
      throw new BadRequestException(
        "Only JPEG, PNG and WEBP images are allowed.",
      );
    }


    return normalized as
      TaskReportImageContentType;
  }


  /*
   * =========================================================
   * FILE SIZE VALIDATION
   * =========================================================
   */
  private validateImageSize(
    size:
      number,
  ): void {
    if (
      !Number.isInteger(
        size,
      ) ||
      size <=
        0
    ) {
      throw new BadRequestException(
        "Invalid image file size.",
      );
    }


    if (
      size >
      MAX_TASK_REPORT_IMAGE_SIZE
    ) {
      throw new BadRequestException(
        "Task report image must not exceed 5 MB.",
      );
    }
  }


  /*
   * =========================================================
   * STORAGE KEY VALIDATION
   * =========================================================
   */
  private validateStorageKey(
    value:
      string,
  ): string {
    const storageKey =
      value.trim();


    if (!storageKey) {
      throw new BadRequestException(
        "Storage key is required.",
      );
    }


    /*
     * Client-provided key me normalization
     * nahi karenge.
     *
     * Invalid path ko outright reject karenge.
     */
    if (
      storageKey.startsWith(
        "/",
      ) ||
      storageKey.includes(
        "\\",
      )
    ) {
      throw new BadRequestException(
        "Invalid storage key.",
      );
    }


    const segments =
      storageKey.split(
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
      throw new BadRequestException(
        "Invalid storage key.",
      );
    }


    return storageKey;
  }
}
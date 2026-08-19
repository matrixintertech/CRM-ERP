import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";

import type {
  ProjectTaskReportType,
} from "../api/my-task.api";

import type {
  MyTask,
} from "../types/my-task.types";


const MAX_IMAGES =
  5;

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;


interface SelectedImage {
  id:
    string;

  file:
    File;

  previewUrl:
    string;
}


interface TaskReportModalProps {
  open:
    boolean;

  task:
    MyTask | null;

  type:
    ProjectTaskReportType | null;

  loading:
    boolean;

  onClose:
    () => void;

  onSubmit:
    (
      message: string,
      files: File[],
    ) => Promise<void>;
}


const TaskReportModal = ({
  open,
  task,
  type,
  loading,
  onClose,
  onSubmit,
}: TaskReportModalProps) => {
  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    selectedImages,
    setSelectedImages,
  ] =
    useState<
      SelectedImage[]
    >([]);


  const [
    fileError,
    setFileError,
  ] =
    useState<
      string | null
    >(null);


  const galleryInputRef =
    useRef<
      HTMLInputElement | null
    >(null);


  const cameraInputRef =
    useRef<
      HTMLInputElement | null
    >(null);


  /*
   * =========================================================
   * RESET MODAL
   * =========================================================
   */
  useEffect(
    () => {
      setMessage("");

      setFileError(
        null,
      );

      setSelectedImages(
        (
          current,
        ) => {
          current.forEach(
            (
              image,
            ) => {
              URL.revokeObjectURL(
                image.previewUrl,
              );
            },
          );

          return [];
        },
      );
    },
    [
      open,
      task?.uuid,
      type,
    ],
  );


  const config =
    useMemo(
      () =>
        getReportConfig(
          type,
        ),
      [
        type,
      ],
    );


  const normalizedMessage =
    message.trim();


  const canSubmit =
    Boolean(
      task &&
      type &&
      normalizedMessage,
    ) &&
    !loading;


  /*
   * =========================================================
   * RESET SELECTED IMAGES
   * =========================================================
   */
  const clearSelectedImages =
    () => {
      setSelectedImages(
        (
          current,
        ) => {
          current.forEach(
            (
              image,
            ) => {
              URL.revokeObjectURL(
                image.previewUrl,
              );
            },
          );

          return [];
        },
      );
    };


  /*
   * =========================================================
   * ADD IMAGE FILES
   * =========================================================
   */
  const handleFilesSelected = (
    files:
      FileList | null,
  ) => {
    setFileError(
      null,
    );


    if (
      !files ||
      files.length ===
        0
    ) {
      return;
    }


    const incomingFiles =
      Array.from(
        files,
      );


    if (
      selectedImages.length +
        incomingFiles.length >
      MAX_IMAGES
    ) {
      setFileError(
        `A maximum of ${MAX_IMAGES} images can be attached.`,
      );

      return;
    }


    const existingKeys =
      new Set(
        selectedImages.map(
          (
            image,
          ) =>
            getFileIdentity(
              image.file,
            ),
        ),
      );


    const newKeys =
      new Set<string>();


    for (
      const file of
      incomingFiles
    ) {
      if (
        !ALLOWED_IMAGE_TYPES.includes(
          file.type as
            typeof ALLOWED_IMAGE_TYPES[number],
        )
      ) {
        setFileError(
          "Only JPEG, PNG and WEBP images are allowed.",
        );

        return;
      }


      if (
        file.size <=
        0
      ) {
        setFileError(
          "One of the selected images is empty or invalid.",
        );

        return;
      }


      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        setFileError(
          `${file.name} exceeds the 5 MB image limit.`,
        );

        return;
      }


      if (
        file.name.length >
        255
      ) {
        setFileError(
          "Image filename must not exceed 255 characters.",
        );

        return;
      }


      const identity =
        getFileIdentity(
          file,
        );


      if (
        existingKeys.has(
          identity,
        ) ||
        newKeys.has(
          identity,
        )
      ) {
        setFileError(
          `${file.name} has already been selected.`,
        );

        return;
      }


      newKeys.add(
        identity,
      );
    }


    const images =
      incomingFiles.map(
        (
          file,
        ): SelectedImage => ({
          id:
            createImageId(
              file,
            ),

          file,

          previewUrl:
            URL.createObjectURL(
              file,
            ),
        }),
      );


    setSelectedImages(
      (
        current,
      ) => [
        ...current,
        ...images,
      ],
    );
  };


  /*
   * =========================================================
   * REMOVE IMAGE
   * =========================================================
   */
  const handleRemoveImage = (
    imageId:
      string,
  ) => {
    if (
      loading
    ) {
      return;
    }


    setFileError(
      null,
    );


    setSelectedImages(
      (
        current,
      ) =>
        current.filter(
          (
            image,
          ) => {
            if (
              image.id ===
              imageId
            ) {
              URL.revokeObjectURL(
                image.previewUrl,
              );

              return false;
            }

            return true;
          },
        ),
    );
  };


  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */
  const handleClose =
    () => {
      if (
        loading
      ) {
        return;
      }


      setMessage("");

      setFileError(
        null,
      );

      clearSelectedImages();

      onClose();
    };


  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */
  const handleSubmit =
    async () => {
      if (
        !canSubmit
      ) {
        return;
      }


      await onSubmit(
        normalizedMessage,

        selectedImages.map(
          (
            image,
          ) =>
            image.file,
        ),
      );
    };


  return (
    <Modal
      open={
        open
      }
      title={
        config.title
      }
      onClose={
        handleClose
      }
    >
      {!task ||
      !type ? (
        <div
          style={{
            color:
              "#6b7280",

            fontSize:
              14,
          }}
        >
          Task information is not available.
        </div>
      ) : (
        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            gap:
              20,
          }}
        >
          {/* Task Summary */}

          <section
            style={{
              padding:
                "14px 16px",

              border:
                "1px solid #e5e7eb",

              borderRadius:
                10,

              background:
                "#f8fafc",
            }}
          >
            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "flex-start",

                gap:
                  12,

                flexWrap:
                  "wrap",
              }}
            >
              <div
                style={{
                  minWidth:
                    0,

                  flex:
                    1,
                }}
              >
                <div
                  style={{
                    color:
                      "#111827",

                    fontSize:
                      15,

                    fontWeight:
                      600,
                  }}
                >
                  {
                    task.title
                  }
                </div>


                <div
                  style={{
                    marginTop:
                      5,

                    color:
                      "#6b7280",

                    fontSize:
                      12,
                  }}
                >
                  {
                    task.project.name
                  }
                  {" · "}
                  {
                    task.project.srn
                  }
                </div>
              </div>


              <span
                style={{
                  padding:
                    "5px 9px",

                  borderRadius:
                    999,

                  background:
                    config.background,

                  color:
                    config.color,

                  fontSize:
                    11,

                  fontWeight:
                    700,

                  whiteSpace:
                    "nowrap",
                }}
              >
                {
                  config.label
                }
              </span>
            </div>


            {task.description && (
              <div
                style={{
                  marginTop:
                    12,

                  color:
                    "#4b5563",

                  fontSize:
                    13,

                  lineHeight:
                    1.5,
                }}
              >
                {
                  task.description
                }
              </div>
            )}
          </section>


          {/* Report Message */}

          <div>
            <label
              htmlFor="task-report-message"
              style={{
                display:
                  "block",

                marginBottom:
                  8,

                color:
                  "#374151",

                fontSize:
                  13,

                fontWeight:
                  600,
              }}
            >
              {
                config.fieldLabel
              }
            </label>


            <textarea
              id="task-report-message"
              name="message"
              rows={
                7
              }
              maxLength={
                5000
              }
              autoFocus
              disabled={
                loading
              }
              placeholder={
                config.placeholder
              }
              value={
                message
              }
              onChange={(
                event,
              ) =>
                setMessage(
                  event.target
                    .value,
                )
              }
              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "12px 14px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  8,

                resize:
                  "vertical",

                minHeight:
                  150,

                color:
                  "#111827",

                background:
                  loading
                    ? "#f9fafb"
                    : "#ffffff",

                fontFamily:
                  "inherit",

                fontSize:
                  14,

                lineHeight:
                  1.5,

                outline:
                  "none",
              }}
            />


            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                gap:
                  12,

                marginTop:
                  6,

                color:
                  "#6b7280",

                fontSize:
                  11,
              }}
            >
              <span>
                {
                  config.helpText
                }
              </span>

              <span
                style={{
                  whiteSpace:
                    "nowrap",
                }}
              >
                {
                  message.length
                }
                /5000
              </span>
            </div>
          </div>


          {/* Evidence Images */}

          <section>
            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  12,

                flexWrap:
                  "wrap",

                marginBottom:
                  8,
              }}
            >
              <div>
                <div
                  style={{
                    color:
                      "#374151",

                    fontSize:
                      13,

                    fontWeight:
                      600,
                  }}
                >
                  Evidence Images
                </div>

                <div
                  style={{
                    marginTop:
                      3,

                    color:
                      "#6b7280",

                    fontSize:
                      11,
                  }}
                >
                  JPEG, PNG or WEBP · max 5 MB each · up to 5 images
                </div>
              </div>


              <div
                style={{
                  color:
                    "#6b7280",

                  fontSize:
                    12,

                  fontWeight:
                    600,
                }}
              >
                {
                  selectedImages.length
                }
                /{MAX_IMAGES}
              </div>
            </div>


            {/* Hidden Gallery Input */}

            <input
              ref={
                galleryInputRef
              }
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={
                loading ||
                selectedImages.length >=
                  MAX_IMAGES
              }
              onChange={(
                event,
              ) => {
                handleFilesSelected(
                  event.target.files,
                );

                event.target.value =
                  "";
              }}
              style={{
                display:
                  "none",
              }}
            />


            {/* Hidden Camera Input */}

            <input
              ref={
                cameraInputRef
              }
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              disabled={
                loading ||
                selectedImages.length >=
                  MAX_IMAGES
              }
              onChange={(
                event,
              ) => {
                handleFilesSelected(
                  event.target.files,
                );

                event.target.value =
                  "";
              }}
              style={{
                display:
                  "none",
              }}
            />


            <div
              style={{
                display:
                  "flex",

                gap:
                  8,

                flexWrap:
                  "wrap",
              }}
            >
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={
                  loading ||
                  selectedImages.length >=
                    MAX_IMAGES
                }
                onClick={() =>
                  galleryInputRef
                    .current
                    ?.click()
                }
              >
                Select Images
              </Button>


              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={
                  loading ||
                  selectedImages.length >=
                    MAX_IMAGES
                }
                onClick={() =>
                  cameraInputRef
                    .current
                    ?.click()
                }
              >
                Take Photo
              </Button>
            </div>


            {fileError && (
              <div
                style={{
                  marginTop:
                    8,

                  padding:
                    "8px 10px",

                  borderRadius:
                    6,

                  background:
                    "#fef2f2",

                  color:
                    "#b91c1c",

                  fontSize:
                    12,
                }}
              >
                {
                  fileError
                }
              </div>
            )}


            {/* Image Previews */}

            {selectedImages.length >
              0 && (
              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(120px, 1fr))",

                  gap:
                    10,

                  marginTop:
                    12,
                }}
              >
                {selectedImages.map(
                  (
                    image,
                  ) => (
                    <div
                      key={
                        image.id
                      }
                      style={{
                        position:
                          "relative",

                        overflow:
                          "hidden",

                        border:
                          "1px solid #e5e7eb",

                        borderRadius:
                          8,

                        background:
                          "#f9fafb",
                      }}
                    >
                      <img
                        src={
                          image.previewUrl
                        }
                        alt={
                          image.file.name
                        }
                        style={{
                          display:
                            "block",

                          width:
                            "100%",

                          height:
                            110,

                          objectFit:
                            "cover",
                        }}
                      />


                      <div
                        style={{
                          padding:
                            "7px 8px",
                        }}
                      >
                        <div
                          title={
                            image.file.name
                          }
                          style={{
                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",

                            color:
                              "#374151",

                            fontSize:
                              11,

                            fontWeight:
                              600,
                          }}
                        >
                          {
                            image.file.name
                          }
                        </div>

                        <div
                          style={{
                            marginTop:
                              2,

                            color:
                              "#6b7280",

                            fontSize:
                              10,
                          }}
                        >
                          {
                            formatFileSize(
                              image.file
                                .size,
                            )
                          }
                        </div>
                      </div>


                      <button
                        type="button"
                        disabled={
                          loading
                        }
                        aria-label={`Remove ${image.file.name}`}
                        onClick={() =>
                          handleRemoveImage(
                            image.id,
                          )
                        }
                        style={{
                          position:
                            "absolute",

                          top:
                            6,

                          right:
                            6,

                          width:
                            26,

                          height:
                            26,

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          border:
                            "none",

                          borderRadius:
                            "50%",

                          background:
                            "rgba(17, 24, 39, 0.78)",

                          color:
                            "#ffffff",

                          cursor:
                            loading
                              ? "not-allowed"
                              : "pointer",

                          fontSize:
                            16,

                          lineHeight:
                            1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>


          {/* Upload State */}

          {loading &&
            selectedImages.length >
              0 && (
            <div
              style={{
                padding:
                  "10px 12px",

                borderRadius:
                  8,

                background:
                  "#eff6ff",

                color:
                  "#1d4ed8",

                fontSize:
                  12,
              }}
            >
              Uploading evidence images and saving report...
            </div>
          )}


          {/* Actions */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "flex-end",

              gap:
                10,

              paddingTop:
                4,

              borderTop:
                "1px solid #f3f4f6",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={
                loading
              }
              onClick={
                handleClose
              }
            >
              Cancel
            </Button>


            <Button
              type="button"
              variant={
                type ===
                "BLOCKER"
                  ? "danger"
                  : undefined
              }
              loading={
                loading
              }
              disabled={
                !canSubmit
              }
              onClick={
                handleSubmit
              }
            >
              {
                config.submitLabel
              }
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


/*
 * =========================================================
 * FILE HELPERS
 * =========================================================
 */
const getFileIdentity = (
  file:
    File,
) => {
  return [
    file.name,
    file.size,
    file.lastModified,
  ].join(
    ":",
  );
};


const createImageId = (
  file:
    File,
) => {
  return [
    getFileIdentity(
      file,
    ),
    Date.now(),
    Math.random()
      .toString(
        36,
      )
      .slice(
        2,
      ),
  ].join(
    ":",
  );
};


const formatFileSize = (
  bytes:
    number,
) => {
  if (
    bytes <
    1024
  ) {
    return `${bytes} B`;
  }


  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes /
      1024
    ).toFixed(
      1,
    )} KB`;
  }


  return `${(
    bytes /
    (
      1024 *
      1024
    )
  ).toFixed(
    1,
  )} MB`;
};


const getReportConfig = (
  type:
    ProjectTaskReportType | null,
) => {
  switch (
    type
  ) {
    case "BLOCKER":
      return {
        title:
          "Report Blocker",

        label:
          "BLOCKER",

        fieldLabel:
          "Describe the blocker",

        placeholder:
          "Explain what is blocking your work, what you need, and any relevant details...",

        helpText:
          "The task will remain In Progress.",

        submitLabel:
          "Report Blocker",

        background:
          "#fef2f2",

        color:
          "#b91c1c",
      };


    case "NOTE":
      return {
        title:
          "Add Task Note",

        label:
          "NOTE",

        fieldLabel:
          "Note",

        placeholder:
          "Add any useful note or context about this task...",

        helpText:
          "Use notes for additional task context.",

        submitLabel:
          "Add Note",

        background:
          "#f3f4f6",

        color:
          "#374151",
      };


    case "PROGRESS":
    default:
      return {
        title:
          "Add Progress Update",

        label:
          "PROGRESS",

        fieldLabel:
          "Progress update",

        placeholder:
          "Describe what you completed, current progress, and what you are working on next...",

        helpText:
          "Share a clear update about your task progress.",

        submitLabel:
          "Add Progress",

        background:
          "#eff6ff",

        color:
          "#1d4ed8",
      };
  }
};


export default TaskReportModal;
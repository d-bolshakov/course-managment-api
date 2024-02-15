import type { AttachmentDto } from "../dto/attachment/attachment.dto";

type AssignmentAttachmentEvents = {
  "assignment-attachment/deleted": (
    payload: AttachmentDto | AttachmentDto[]
  ) => void;
};

type SubmissionAttachmentEvents = {
  "submission-attachment/deleted": (
    payload: AttachmentDto | AttachmentDto[]
  ) => void;
};

export type AttachmentEvents = AssignmentAttachmentEvents &
  SubmissionAttachmentEvents;

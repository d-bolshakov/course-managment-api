import type { AttachmentEvents } from "./attachment.events";
import type { FileEvents } from "./file.events";
import type { UserEvents } from "./user.events";

export type Events = UserEvents & AttachmentEvents & FileEvents;

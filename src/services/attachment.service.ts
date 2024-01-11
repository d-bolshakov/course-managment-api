import { AppDataSource } from "../db/data-source";
import {
  Assignment,
  AssignmentAttachment,
  Submission,
  SubmissionAttachment,
} from "../entities";
import { UploadedFile } from "express-fileupload";
import { fileService } from "./file.service";

class AttachmentService {
  private assigAttachmentRepository =
    AppDataSource.getRepository(AssignmentAttachment);
  private submAttachmentRepository =
    AppDataSource.getRepository(SubmissionAttachment);

  async createForAssignment(
    assignment: Assignment,
    file: UploadedFile | UploadedFile[]
  ) {
    const fileEntities = await fileService.create(file);
    let attachment = fileEntities.map((file) =>
      this.assigAttachmentRepository.create({ assignment, file })
    );
    return this.assigAttachmentRepository.save(attachment as any);
  }

  async createForSubmission(
    submission: Submission,
    file: UploadedFile | UploadedFile[]
  ) {
    const fileEntities = await fileService.create(file);
    let attachment = fileEntities.map((file) =>
      this.submAttachmentRepository.create({ submission, file })
    );
    return this.submAttachmentRepository.save(attachment as any);
  }

  async createMany(files: UploadedFile[]) {}

  async getOne(id: string) {}
}

export const attachmentService = new AttachmentService();

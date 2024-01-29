import { AppDataSource } from "../db/data-source.js";
import { UploadedFile } from "express-fileupload";
import { fileService } from "./file.service.js";
import { plainToInstance } from "class-transformer";
import { AttachmentDto } from "../dto/attachment/attachment.dto.js";
import { AssignmentAttachment } from "../entities/AssignmentAttachment.entity.js";
import { SubmissionAttachment } from "../entities/SubmissionAttachment.entity.js";

class AttachmentService {
  private assigAttachmentRepository =
    AppDataSource.getRepository(AssignmentAttachment);
  private submAttachmentRepository =
    AppDataSource.getRepository(SubmissionAttachment);

  async createForAssignment(
    assignmentId: number,
    file: UploadedFile | UploadedFile[]
  ) {
    const savedFile = await fileService.create(file);
    let attachment = savedFile.map((file) =>
      this.assigAttachmentRepository.create({ assignmentId, fileId: file.id })
    );
    await this.assigAttachmentRepository.save(attachment as any);
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }

  async createForSubmission(
    submissionId: number,
    file: UploadedFile | UploadedFile[]
  ) {
    const savedFiles = await fileService.create(file);
    let attachment = savedFiles.map((file) =>
      this.submAttachmentRepository.create({ submissionId, fileId: file.id })
    );
    await this.submAttachmentRepository.save(attachment as any);
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }
}

export const attachmentService = new AttachmentService();

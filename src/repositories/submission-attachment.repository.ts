import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { SubmissionAttachment } from "../entities/SubmissionAttachment.entity.js";
import { AttachmentDto } from "../dto/attachment/attachment.dto.js";
import { CreateSubmissionAttachmentDto } from "../dto/attachment/create-submission-attachment.dto.js";
import type { ISubmissionAttachmentRepository } from "../interfaces/repositories/submission-attachment-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class SubmissionAttachmentRepository
  implements ISubmissionAttachmentRepository
{
  private submissionAttachmentRepo =
    AppDataSource.getRepository(SubmissionAttachment);

  async create(
    dto: CreateSubmissionAttachmentDto | CreateSubmissionAttachmentDto[]
  ) {
    // @ts-expect-error
    const attachment = await this.submissionAttachmentRepo.save(dto);
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }
  async deleteById(id: number) {
    try {
      const { affected } = await this.submissionAttachmentRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }
  async getById(id: number) {
    const attachment = await this.submissionAttachmentRepo.findOne({
      where: { id },
    });
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }
}

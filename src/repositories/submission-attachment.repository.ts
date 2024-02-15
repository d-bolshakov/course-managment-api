import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { SubmissionAttachment } from "../entities/SubmissionAttachment.entity.js";
import { AttachmentDto } from "../dto/attachment/attachment.dto.js";
import { CreateSubmissionAttachmentDto } from "../dto/attachment/create-submission-attachment.dto.js";
import type { ISubmissionAttachmentRepository } from "../interfaces/repositories/submission-attachment-repository.interface.js";
import { injectable } from "tsyringe";
import { In } from "typeorm";

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
  async deleteById(id: number | number[]) {
    const qb = this.submissionAttachmentRepo
      .createQueryBuilder()
      .delete()
      .returning("*");
    if (Array.isArray(id)) qb.whereInIds(id);
    else qb.where("id = :id", { id });
    const { raw } = await qb.execute();
    return { deleted: plainToInstance(AttachmentDto, raw as any[]) };
  }
  async getById(id: number) {
    const attachment = await this.submissionAttachmentRepo.findOne({
      where: { id },
    });
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }

  async getManyById(id: number[]) {
    const attachments = await this.submissionAttachmentRepo.find({
      where: { id: In(id) },
    });
    return plainToInstance(AttachmentDto, attachments, {
      exposeUnsetFields: false,
    });
  }
}

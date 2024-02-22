import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { AssignmentAttachment } from "../db/entities/AssignmentAttachment.entity.js";
import { AttachmentDto } from "../dto/attachment/attachment.dto.js";
import { CreateAssignmentAttachmentDto } from "../dto/attachment/create-assignment-attachment.dto.js";
import type { IAssignmentAttachmentRepository } from "../interfaces/repositories/assignment-attachment-repository.interface.js";
import { injectable } from "tsyringe";
import { In } from "typeorm";

@injectable()
export class AssignmentAttachmentRepository
  implements IAssignmentAttachmentRepository
{
  private assignmentAttachmentRepo =
    AppDataSource.getRepository(AssignmentAttachment);

  async create(
    dto: CreateAssignmentAttachmentDto | CreateAssignmentAttachmentDto[]
  ) {
    // @ts-expect-error
    const attachment = await this.assignmentAttachmentRepo.save(dto);
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }
  async deleteById(id: number | number[]) {
    const qb = this.assignmentAttachmentRepo
      .createQueryBuilder()
      .delete()
      .returning("*");
    if (Array.isArray(id)) qb.whereInIds(id);
    else qb.where("id = :id", { id });
    const { raw } = await qb.execute();
    return { deleted: plainToInstance(AttachmentDto, raw as any[]) };
  }

  async getById(id: number) {
    const attachment = await this.assignmentAttachmentRepo.findOne({
      where: { id },
    });
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }

  async getManyById(id: number[]) {
    const attachments = await this.assignmentAttachmentRepo.find({
      where: { id: In(id) },
    });
    return plainToInstance(AttachmentDto, attachments, {
      exposeUnsetFields: false,
    });
  }
}

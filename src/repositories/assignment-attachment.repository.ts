import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { AssignmentAttachment } from "../entities/AssignmentAttachment.entity.js";
import { AttachmentDto } from "../dto/attachment/attachment.dto.js";
import { CreateAssignmentAttachmentDto } from "../dto/attachment/create-assignment-attachment.dto.js";
import type { IAssignmentAttachmentRepository } from "../interfaces/repositories/assignment-attachment-repository.interface.js";
import { injectable } from "tsyringe";

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
  async deleteById(id: number) {
    try {
      const { affected } = await this.assignmentAttachmentRepo.delete({ id });
      if (!affected) return { success: false };
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  }
  async getById(id: number) {
    const attachment = await this.assignmentAttachmentRepo.findOne({
      where: { id },
    });
    return plainToInstance(AttachmentDto, attachment, {
      exposeUnsetFields: false,
    });
  }
}

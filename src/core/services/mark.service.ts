import createError from "http-errors";
import type { IMarkService } from "./interfaces/mark-service.interface.js";
import { CreateMarkDto } from "../../dto/mark/create-mark.dto.js";
import { inject, injectable } from "tsyringe";
import type { IMarkRepository } from "../../repositories/interfaces/mark-repository.interface.js";

@injectable()
export class MarkService implements IMarkService {
  constructor(
    @inject("mark-repository") private markRepository: IMarkRepository
  ) {}

  async create(dto: CreateMarkDto) {
    return this.markRepository.create(dto);
  }

  async delete(id: number) {
    const exists = await this.markRepository.existsWithId(id);
    if (!exists)
      throw createError.NotFound(`Mark with id ${id} does not exist`);
    const result = await this.markRepository.deleteById(id);
    if (!result.success)
      throw createError.InternalServerError(
        `Something went wrong during deleting mark with id ${id}`
      );
    return result;
  }
}

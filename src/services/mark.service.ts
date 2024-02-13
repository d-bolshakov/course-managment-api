import createError from "http-errors";
import type { IMarkService } from "../interfaces/services/mark-service.interface.js";
import { CreateMarkDto } from "../dto/mark/create-mark.dto.js";
import { inject, injectable } from "tsyringe";
import type { IMarkRepository } from "../interfaces/repositories/mark-repository.interface.js";

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
    await this.markRepository.deleteById(id);
    return { message: `Mark with id ${id} was deleted successfully` };
  }
}

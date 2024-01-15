import { AppDataSource } from "../db/data-source";
import { BadRequest } from "http-errors";
import { Mark } from "../entities";
import {
  Between,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util";
import { MarkDto } from "../dto";
import { FilterMarkDto } from "../dto/";

class MarkService {
  private markRepository = AppDataSource.getRepository(Mark);

  async create(dto: MarkDto) {
    const { mark } = dto;
    const nmark = new Mark();
    nmark.mark = mark;
    return this.markRepository.save(nmark);
  }

  async getOne(
    conditions: FindOptionsWhere<Mark>,
    options?: {
      relations?: FindOptionsRelations<Mark>;
      select?: FindOptionsSelect<Mark>;
    }
  ) {
    return this.markRepository.findOne({
      where: conditions,
      relations: options?.relations,
      select: options?.select,
    });
  }

  async getMany(options: {
    filters: FilterMarkDto;
    select?: FindOptionsSelect<Mark>;
    relations?: FindOptionsRelations<Mark>;
    page?: number;
  }) {
    const conditions: FindOptionsWhere<Mark> = {};
    const {
      studentId,
      courseId,
      assignmentId,
      submissionId,
      higherThan,
      lowerThan,
    } = options.filters;
    if (submissionId) conditions.review = { id: submissionId };
    if (assignmentId)
      conditions.review = { submission: { assignment: { id: assignmentId } } };
    if (courseId)
      conditions.review = {
        submission: { assignment: { course: { id: courseId } } },
      };
    if (studentId)
      conditions.review = { submission: { student: { id: studentId } } };
    if (higherThan || lowerThan) {
      if (higherThan && lowerThan)
        conditions.mark = Between(higherThan, lowerThan);
      else if (higherThan) conditions.mark = MoreThanOrEqual(higherThan);
      else conditions.mark = LessThanOrEqual(lowerThan);
    }
    const findOptions: FindManyOptions<Mark> = {
      select: options.select,
      where: conditions,
      relations: options?.relations,
    };
    findOptions.take = 10;
    findOptions.skip = getPaginationOffset(options?.page || 1);
    return this.markRepository.find(findOptions);
  }

  async getById(
    id: number,
    options?: {
      relations?: FindOptionsRelations<Mark>;
      select?: FindOptionsSelect<Mark>;
    }
  ) {
    const mark = await this.getOne({ id }, options);
    if (!mark) throw new BadRequest(`Mark with id ${id} does not exist`);
    return mark;
  }

  async delete(id: number) {
    const mark = await this.getById(id);
    await this.markRepository.remove(mark);
    return { message: `Mark with id ${id} was deleted successfully` };
  }
}

export const markService = new MarkService();

import { AppDataSource } from "../db/data-source.js";
import createError from "http-errors";
import {
  Between,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from "typeorm";
import { getPaginationOffset } from "../utils/pagination-offset.util.js";
import { plainToInstance } from "class-transformer";
import { FilterMarkDto } from "../dto/mark/filter-mark.dto.js";
import { MarkDto } from "../dto/mark/mark.dto.js";
import { Mark } from "../entities/Mark.entity.js";

class MarkService {
  private markRepository = AppDataSource.getRepository(Mark);

  async create(dto: { mark: number }) {
    const mark = this.markRepository.create({ mark: dto.mark });
    await this.markRepository.save(mark);
    return plainToInstance(MarkDto, mark, {
      exposeUnsetFields: false,
    });
  }

  async getMany(options: {
    filters: FilterMarkDto;
    select?: FindOptionsSelect<Mark>;
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
    const marks = await this.markRepository.find({
      select: options.select,
      where: conditions,
      take: 10,
      skip: getPaginationOffset(options?.filters.page || 1),
    });
    return plainToInstance(MarkDto, marks, {
      exposeUnsetFields: false,
    });
  }

  async delete(id: number) {
    const mark = await this.markRepository.findOne({ where: { id } });
    if (!mark)
      throw new createError.NotFound(`Mark with id ${id} does not exist`);
    await this.markRepository.remove(mark);
    return { message: `Mark with id ${id} was deleted successfully` };
  }
}

export const markService = new MarkService();

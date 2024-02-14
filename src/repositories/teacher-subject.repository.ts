import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../db/data-source.js";
import { TeacherSubjectDto } from "../dto/teacher-subject/teacher-subject.dto.js";
import type { ITeacherSubjectRepository } from "../interfaces/repositories/teacher-subject-repository.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class TeacherSubjectRepository implements ITeacherSubjectRepository {
  async create(items: TeacherSubjectDto[]) {
    const { generatedMaps: result } = await AppDataSource.createQueryBuilder()
      .insert()
      .into("teacher_subject")
      .values(items)
      .execute();
    return plainToInstance(TeacherSubjectDto, result);
  }

  async deleteManyByTeacherId(teacherId: number) {
    try {
      const { affected } = await AppDataSource.createQueryBuilder()
        .delete()
        .from("teacher_subject")
        .where("teacherId  = :teacherId", { teacherId })
        .execute();
      if (!affected) return { success: false };
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async teacherHasSubject(teacherId: number, subjectId: number) {
    return AppDataSource.createQueryBuilder()
      .from("teacher_subject", "ts")
      .where("ts.teacherId = :teacherId", { teacherId })
      .andWhere("ts.subjectId = :subjectId", { subjectId })
      .getExists();
  }
}

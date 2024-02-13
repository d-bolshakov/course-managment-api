import type { TeacherSubjectDto } from "../../dto/teacher-subject/teacher-subject.dto";

export interface ITeacherSubjectRepository {
  create(items: TeacherSubjectDto[]): Promise<TeacherSubjectDto[]>;
  deleteManyByTeacherId(teacherId: number): Promise<{ success: boolean }>;
  teacherHasSubject(teacherId: number, subjectId: number): Promise<boolean>;
}

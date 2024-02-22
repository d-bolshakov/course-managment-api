import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { Course } from "./Course.entity.js";
import { Student } from "./Student.entity.js";

export enum EnrollmentStatus {
  APPLIED = "applied",
  INVITED = "invited",
  ENROLLED = "enrolled",
}

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.enrollments, { nullable: false })
  @JoinColumn()
  course: typeorm.Relation<Course>;

  @Column("integer", { nullable: false })
  @RelationId((enrollment: Enrollment) => enrollment.course)
  courseId: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
  })
  @JoinColumn()
  student: typeorm.Relation<Student>;

  @Column("integer", { nullable: false })
  @RelationId((enrollment: Enrollment) => enrollment.student)
  studentId: number;

  @Column("enum", {
    enum: EnrollmentStatus,
    default: EnrollmentStatus.APPLIED,
    nullable: false,
  })
  status: typeorm.Relation<EnrollmentStatus> = EnrollmentStatus.APPLIED;

  @Column("timestamptz", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  changedAt: Date;
}

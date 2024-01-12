import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { Course, Student } from "./";

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
  course!: Course;

  @Column("integer", { nullable: false })
  @RelationId((enrollment: Enrollment) => enrollment.course)
  courseId: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
  })
  @JoinColumn()
  student!: Student;

  @Column("integer", { nullable: false })
  @RelationId((enrollment: Enrollment) => enrollment.student)
  studentId: number;

  @Column("enum", {
    enum: EnrollmentStatus,
    default: EnrollmentStatus.APPLIED,
    nullable: false,
  })
  status: EnrollmentStatus = EnrollmentStatus.APPLIED;

  @Column("timestamptz", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  changedAt: Date;
}

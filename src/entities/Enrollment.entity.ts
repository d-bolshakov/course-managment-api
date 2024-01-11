import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { Course, Student } from "./";

export enum Status {
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

  @Column("enum", { enum: Status, default: Status.APPLIED, nullable: false })
  status: Status = Status.APPLIED;

  @Column("timestamptz", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  changedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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
  id: number = 0;

  @ManyToOne(() => Course, (course) => course.enrollments, { nullable: false })
  @JoinColumn()
  course!: Course;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
  })
  @JoinColumn()
  student!: Student;

  @Column("enum", { enum: Status, default: Status.APPLIED, nullable: false })
  status: Status = Status.APPLIED;

  @Column("timestamptz", { nullable: false })
  changedAt: Date = new Date();
}

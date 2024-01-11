import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
} from "typeorm";
import { Teacher, Subject, Enrollment, Assignment, Mark } from "./";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 30, nullable: false })
  title: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn()
  teacher!: Teacher;

  @Column("integer", { nullable: false })
  @RelationId((course: Course) => course.teacher)
  teacherId: number;

  @ManyToOne(() => Subject, { nullable: false })
  @JoinColumn()
  subject!: Subject;

  @Column("integer", { nullable: false })
  @RelationId((course: Course) => course.subject)
  subjectId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments!: Enrollment[];

  @Column("integer", { nullable: false })
  maxStudents: number;

  @Column("timestamp", { nullable: false })
  startsAt: Date;

  @Column("timestamp", { nullable: false })
  endsAt: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.course, {
    cascade: true,
  })
  assignments!: Assignment[];
}

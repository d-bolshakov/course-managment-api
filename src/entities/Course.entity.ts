import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Teacher, Subject, Enrollment } from "./";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column("varchar", { length: 30, nullable: false })
  title: string = "";

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn()
  teacher!: Teacher;

  @ManyToOne(() => Subject, { nullable: false })
  @JoinColumn()
  subject!: Subject;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments!: Enrollment[];

  @Column("integer", { nullable: false })
  maxStudents: number = 0;

  @Column("timestamp", { nullable: false })
  startsAt: Date = new Date();

  @Column("timestamp", { nullable: false })
  endsAt: Date = new Date();
}

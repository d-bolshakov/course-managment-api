import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  RelationId,
  Column,
} from "typeorm";
import { User, Course, Subject } from "./";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user!: User;

  @Column("integer", { nullable: false })
  @RelationId((teacher: Teacher) => teacher.user)
  userId: number;

  @ManyToMany(() => Subject, (subject) => subject.teachers, { cascade: true })
  @JoinTable({ name: "teacher_subject" })
  subjects!: Subject[];

  @OneToMany(() => Course, (course) => course.teacher, { cascade: true })
  courses!: Course[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { User, Course, Subject } from "./";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user!: User;

  @ManyToMany(() => Subject, (subject) => subject.teachers, { cascade: true })
  @JoinTable({ name: "teacher_subject" })
  subjects!: Subject[];

  @OneToMany(() => Course, (course) => course.teacher, { cascade: true })
  courses!: Course[];
}

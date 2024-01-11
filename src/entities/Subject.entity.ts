import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course, Teacher } from "./";

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column("varchar", { length: 30, nullable: false, unique: true })
  public title: string;

  @OneToMany(() => Course, (course) => course.subject)
  courses: Course[];

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];
}

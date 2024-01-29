import typeorm, {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course.entity.js";
import { Teacher } from "./Teacher.entity.js";

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 30, nullable: false, unique: true })
  title: string;

  @OneToMany(() => Course, (course) => course.subject)
  courses: typeorm.Relation<Course[]>;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: typeorm.Relation<Teacher[]>;
}
